"use server";

import type { Model } from "mongoose";

import { Answer, Question, Tag, User } from "@/database";
import { GlobalSearchParams } from "@/types/action";
import {
  ActionResponse,
  ErrorResponse,
  GlobalSearchedItem,
} from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { GlobalSearchSchema } from "../validations";

type SearchableType = "question" | "answer" | "user" | "tag";

interface ModelInfo<T> {
  model: Model<T>;
  searchField: keyof T;
  type: SearchableType;
}

export async function globalSearch(
  params: GlobalSearchParams
): Promise<ActionResponse<GlobalSearchedItem[]>> {
  const validationResult = await action({
    params,
    schema: GlobalSearchSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  try {
    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };
    const results: {
      title: string;
      type: SearchableType;
      id: string;
    }[] = [];

    type QuestionType = typeof Question.prototype;
    type AnswerType = typeof Answer.prototype;
    type UserType = typeof User.prototype;
    type TagType = typeof Tag.prototype;

    const modelsAndTypes: (
      | ModelInfo<QuestionType>
      | ModelInfo<AnswerType>
      | ModelInfo<UserType>
      | ModelInfo<TagType>
    )[] = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase() as SearchableType | undefined;
    const SearchableTypes: SearchableType[] = [
      "question",
      "answer",
      "user",
      "tag",
    ];

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // If no type is specified, search in all models
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : String(item[searchField]),
            type,
            id: type === "answer" ? String(item.question) : String(item._id),
          }))
        );
      }
    } else {
      // Search in the specified model type
      const modelInfo = modelsAndTypes.find((m) => m.type === typeLower);
      if (!modelInfo) throw new Error("Invalid search type");

      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results.push(
        ...queryResults.map((item) => ({
          title:
            typeLower === "answer"
              ? `Answers containing ${query}`
              : String(item[modelInfo.searchField]),
          type: typeLower,
          id: typeLower === "answer" ? String(item.question) : String(item._id),
        }))
      );
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(results)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
