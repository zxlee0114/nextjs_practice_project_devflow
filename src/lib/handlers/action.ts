"use server";

import { Session } from "next-auth";
import z, { ZodError } from "zod";

import { auth } from "@/auth";

import { UnauthorizedError, ValidationError } from "../http-errors";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
  params?: T;
  schema?: z.ZodType<T>;
  authorize?: boolean;
};

// 1. Checking whether the schema and params are provided and validated.
// 2. Checking whether the user is authorized.
// 3. Connecting to the database.
// 4. Returning the params and session.

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  // 1. Checking whether the schema and params are provided and validated.
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const flattenError = z.flattenError(error);
        throw new ValidationError(
          flattenError.fieldErrors as Record<string, string[]>
        );
      } else {
        throw new Error("Schema validation failed");
      }
    }
  }

  // 2. Checking whether the user is authorized.
  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) throw new UnauthorizedError();
  }

  // 3. & 4.
  await dbConnect();

  return { params, session };
}

export default action;
