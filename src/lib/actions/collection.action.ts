"use server";

import { revalidatePath } from "next/cache";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { Collection, Question } from "@/database";
import { collectionBaseParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { CollectionBaseSchema } from "../validations";

export async function toggleSaveQuestion(
  params: collectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = params;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (!collection) {
      await Collection.create({
        question: questionId,
        author: userId,
      });

      revalidatePath(DYNAMIC_ROUTES.QUESTION_DETAIL(questionId));

      return {
        success: true,
        data: { saved: true },
      };
    }

    await Collection.findByIdAndDelete(collection._id);

    revalidatePath(DYNAMIC_ROUTES.QUESTION_DETAIL(questionId));

    return {
      success: true,
      data: { saved: false },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
