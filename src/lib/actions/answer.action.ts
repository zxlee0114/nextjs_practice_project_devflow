"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { Question, Vote } from "@/database";
import Answer, { TAnswerDoc } from "@/database/answer.model";
import { CreateAnswerParams, DeleteAnswerParams } from "@/types/action";
import {
  ActionResponse,
  Answer as AnswerType,
  ErrorResponse,
  GetAnswerParams,
} from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateAnswerSchema,
  DeleteAnswerSchema,
  GetAnswersSchema,
} from "../validations";

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

export async function getAnwsers(params: GetAnswerParams): Promise<
  ActionResponse<{
    answers: AnswerType[];
    isNext: boolean;
    totalAnswers: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetAnswersSchema,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId, page = 1, pageSize = 10, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  let sortCriteria = {};

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: 1 };
      break;
  }
  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteAnswer(
  params: DeleteAnswerParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { answerId } = params;
  const { user } = validationResult.session!;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) throw new Error("Answer not found");

    if (answer.author.toString() !== user?.id)
      throw new Error("You're not allowed to delete this answer");

    // reduce the question answers count
    await Question.findByIdAndUpdate(
      answer.question,
      { $inc: { answers: -1 } },
      { new: true }
    );

    // delete votes associated with answer
    await Vote.deleteMany({ actionId: answerId, actionType: "answer" });

    // delete the answer
    await Answer.findByIdAndDelete(answerId);

    revalidatePath(DYNAMIC_ROUTES.PROFILE_DETAIL(user?.id));

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
