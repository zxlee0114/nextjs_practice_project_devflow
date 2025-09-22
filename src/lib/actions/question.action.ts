"use server";
import mongoose from "mongoose";

import Question, { TQuestionDoc } from "@/database/question.model";
import TagQuestion, { TTagQuestion } from "@/database/tag-question.model";
import Tag, { TTagDoc } from "@/database/tag.model";
import {
  CreateQuestionParams,
  EditQuestionParams,
  GetQuestionParams,
} from "@/types/action";
import {
  ActionResponse,
  ErrorResponse,
  Question as QuestionDataType,
} from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
} from "../validations";

interface QuestionPopulated extends Omit<TQuestionDoc, "tags"> {
  tags: TTagDoc[]; // populate Question 之後以 TTagDoc 替換原本的 tag 型別
}

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<QuestionDataType>> {
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
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
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

    return { success: true, data: question.toObject() };
    // return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<QuestionDataType>> {
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
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
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

    return { success: true, data: question.toObject() };
    // return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestionById(
  params: GetQuestionParams
): Promise<ActionResponse<QuestionDataType>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;

  try {
    const question = (await Question.findById(questionId).populate(
      "tags"
    )) as QuestionPopulated | null;

    if (!question) throw new Error("Question not fouund");

    return { success: true, data: question.toObject() };
    // return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
