"use server";

/* actions exported:
 * getQuestionsBySearchParams;
 * getQuestionById;
 * editQuestion;
 * createQuestion
 */

import mongoose, { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import Question, { TQuestionDoc } from "@/database/question.model";
import TagQuestion, { TTagQuestion } from "@/database/tag-question.model";
import Tag, { TTagDoc } from "@/database/tag.model";
import {
  CreateQuestionParams,
  EditQuestionParams,
  GetQuestionParams,
  IncreaseQuestionViewParams,
} from "@/types/action";
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Question as QuestionType,
} from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncreaseQuestionViewSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

interface QuestionPopulated extends Omit<TQuestionDoc, "tags"> {
  tags: TTagDoc[]; // populate Question 之後以 TTagDoc 替換原本的 tag 型別
}

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<QuestionType>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { tags, title, content } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = (await Question.create(
      [{ title, content, author: userId }],
      { session }
    )) as TQuestionDoc[] | [];
    if (!question) throw new Error("Failed to create the question");

    const questionId = question._id as mongoose.Types.ObjectId;
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments: TTagQuestion[] = [];

    for (const tag of tags) {
      const existingTag = (await Tag.findOneAndUpdate(
        { name: { $regex: `^${tag}$`, $options: "i" } },
        { $setOnInsert: { name: tag }, $inc: { questionCount: 1 } },
        { upsert: true, new: true, session }
      )) as TTagDoc;

      const updatedTagId = existingTag._id as mongoose.Types.ObjectId;

      tagIds.push(updatedTagId);
      tagQuestionDocuments.push({
        tag: updatedTagId,
        question: questionId,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, {
      session,
      ordered: false,
    });

    await Question.findByIdAndUpdate(
      questionId,
      { $addToSet: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<QuestionType>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { tags, title, content, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = (await Question.findById(questionId).populate(
      "tags"
    )) as QuestionPopulated | null;

    if (!question) throw new Error("Question not found");
    if (question.author.toString() !== userId)
      throw new Error("You are not authorized to edit this question");

    // update title & content if needed
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      // await question.save({ session });
    }

    // find out tags to mutate
    const existingTagNames = question.tags.map((t) => t.name.toLowerCase());
    const lowerTags = tags.map((t) => t.toLowerCase());

    const tagsToAdd = tags.filter(
      (tag) => !existingTagNames.includes(tag.toLowerCase())
    );
    const tagsToRemove = question.tags.filter(
      (eTag) => !lowerTags.includes(eTag.name.toLowerCase())
    );

    // add new tags
    const newTagDocuments = [];
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const newTag = (await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questionCount: 1 } },
          { upsert: true, new: true, session }
        )) as TTagDoc;

        if (newTag) {
          newTagDocuments.push({ tag: newTag._id, question: questionId });

          await Question.findByIdAndUpdate(
            questionId,
            { $addToSet: { tags: newTag._id } },
            { session }
          );
        }
      }
    }

    // remove tags
    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map(
        (tag) => tag._id
      ) as mongoose.Types.ObjectId[];

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questionCount: -1 } },
        { session }
      );

      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session }
      );

      await Question.findByIdAndUpdate(
        questionId,
        { $pull: { tags: { $in: tagIdsToRemove } } },
        { session }
      );
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, {
        session,
        ordered: false,
      });
    }

    await question.save({ session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestionById(
  params: GetQuestionParams
): Promise<ActionResponse<QuestionType>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;

  try {
    const question = (await Question.findById(questionId)
      .populate("tags", "_id name")
      .populate("author", "_id name image")
      .lean()) as QuestionType | null;

    if (!question) throw new Error("Question not fouund");

    return { success: true, data: question };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getQuestionsBySearchParams(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: QuestionType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: FilterQuery<typeof Question> = {};
  let sortCriteria = {};

  try {
    if (filter === "recommended") {
      return { success: true, data: { questions: [], isNext: false } };
    }

    // search
    if (query) {
      filterQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    // filters
    switch (filter) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "unanswered":
        filterQuery.answers = 0;
        sortCriteria = { createdAt: -1 };
        break;
      case "popular":
        sortCriteria = { upvotes: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }

    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean() // return plain object
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const totalQuestions = await Question.countDocuments(filterQuery);
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

export async function increaseQuestionViews(
  params: IncreaseQuestionViewParams
): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({
    params,
    schema: IncreaseQuestionViewSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const updated = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } },
      { new: true } // 回傳更新後的 document
    );

    if (!updated) throw new Error("Question not found");

    revalidatePath(DYNAMIC_ROUTES.QUESTION_DETAIL(questionId));

    return {
      success: true,
      data: { views: updated.views },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
