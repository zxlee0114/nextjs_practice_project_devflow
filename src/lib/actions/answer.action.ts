"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { Question } from "@/database";
import Answer, { TAnswerDoc } from "@/database/answer.model";
import { CreateAnswerParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { CreateAnswerSchema } from "../validations";

export async function createAnwser(
  params: CreateAnswerParams
): Promise<ActionResponse<TAnswerDoc>> {
  const validationResult = await action({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { content, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    const [newAnswer] = await Answer.create(
      [{ author: userId, question: questionId, content }],
      { session }
    );

    if (!newAnswer) throw new Error("Failed to create answer");

    question.answers += 1;
    await question.save({ session });

    await session.commitTransaction();

    revalidatePath(DYNAMIC_ROUTES.QUESTION_DETAIL(questionId));

    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
