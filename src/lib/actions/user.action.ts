"use server";

import { FilterQuery } from "mongoose";

import { Answer, Question } from "@/database";
import User, { UserWithMeta } from "@/database/user.model";
import { GetUserByIdParams, GetUserQuestionsParams } from "@/types/action";
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Question as QuestionType,
} from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  GetUserByIdSchema,
  GetUserQuestionsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function getUsersBySearchParams(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: UserWithMeta[]; isNext: boolean }>> {
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: FilterQuery<typeof User> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserById(params: GetUserByIdParams): Promise<
  ActionResponse<{
    user: UserWithMeta;
    totalQuestions: number;
    totalAnswers: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserByIdSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { userId } = params;
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const totalQuestions = await Question.countDocuments({ author: userId });
    const totalAnswers = await Answer.countDocuments({ author: userId });

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(params: GetUserQuestionsParams): Promise<
  ActionResponse<{
    questions: QuestionType[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 10, userId } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    const questions = await Question.find({ author: userId })
      .populate("tags", "name")
      .populate("author", "name image")
      .skip(skip)
      .limit(limit);

    const totalQuestions = await Question.countDocuments({ author: userId });
    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
