"use server";

/* actions exported:
 * getQuestionsBySearchParams;
 * getQuestionById;
 * editQuestion;
 * createQuestion;
 * increaseQuestionViews
 */

import mongoose, { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { Answer, Collection, Vote } from "@/database";
import Question, { TQuestionDoc } from "@/database/question.model";
import TagQuestion, { TTagQuestion } from "@/database/tag-question.model";
import Tag, { TTagDoc } from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
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
import dbConnect from "../mongoose";
import {
  AskQuestionSchema,
  DeleteQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncreaseQuestionViewSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import { createInteraction } from "./interaction.action";

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
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session }
    );
    if (!question) throw new Error("Failed to create the question");

    const questionId = question._id;
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments: TTagQuestion[] = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: `^${tag}$`, $options: "i" } },
        { $setOnInsert: { name: tag }, $inc: { questionCount: 1 } },
        { upsert: true, new: true, session }
      );

      const updatedTagId = existingTag._id;

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

    // log the interaction
    after(async () => {
      await createInteraction({
        action: "post",
        actionId: question._id.toString(),
        actionTarget: "question",
        authorId: userId as string,
      });
    });

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

export async function deleteQuestion(
  params: DeleteQuestionParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = params;
  const { user } = validationResult.session!;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const question = await Question.findById(questionId).session(session);
    if (!question) throw new Error("Question not found");

    if (question.author.toString() !== user?.id)
      throw new Error("You are not authorized to delete this question");

    // Delete related entries inside the transaction
    await Collection.deleteMany({ question: questionId }).session(session);
    await TagQuestion.deleteMany({ question: questionId }).session(session);

    // For all tags of Question, find them and reduce their count
    if (question.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questionCount: -1 } },
        { session }
      );
    }

    //  Remove all votes of the question
    await Vote.deleteMany({
      actionId: questionId,
      actionType: "question",
    }).session(session);

    // Remove all answers and their votes of the question
    const answers = await Answer.find({ question: questionId }).session(
      session
    );

    if (answers.length > 0) {
      await Answer.deleteMany({ question: questionId }).session(session);

      await Vote.deleteMany({
        actionId: { $in: answers.map((answer) => answer.id) },
        actionType: "answer",
      }).session(session);
    }

    await Question.findByIdAndDelete(questionId).session(session);

    await session.commitTransaction();
    session.endSession();

    revalidatePath(DYNAMIC_ROUTES.PROFILE_DETAIL(user?.id));
    // revalidatePath(`/profile/${user?.id}`);

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return handleError(error) as ErrorResponse;
  }
}

export async function getQuestionById(
  params: GetQuestionParams
): Promise<ActionResponse<QuestionType>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
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

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
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
      { new: true }
    );

    if (!updated) throw new Error("Question not found");

    return {
      success: true,
      data: { views: updated.views },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getTopQuestions({
  limit = 5,
}): Promise<ActionResponse<QuestionType[]>> {
  try {
    await dbConnect();
    const questions = await Question.find()
      .sort({ view: -1, upvote: -1 })
      .limit(limit);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(questions)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
