"use server";

import { FilterQuery } from "mongoose";

import User, { UserWithMeta } from "@/database/user.model";
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getUsersByParams(
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
