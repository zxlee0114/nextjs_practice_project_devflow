"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth"; // note: not from "next-auth/react" or from "next-auth"
import Account from "@/database/account.model";
import User from "@/database/user.model";
import { AuthCredentials } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { SignUpSchema } from "../validations";

const PASSWORD_SALT_COUNT = 12;

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  // validate params, authorize user & connect database
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new Error("User already exists");

    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) throw new Error("Username already exists");

    const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT_COUNT);

    const [newUser] = await User.create([{ username, name, email }], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    console.log({ authError: error });
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
