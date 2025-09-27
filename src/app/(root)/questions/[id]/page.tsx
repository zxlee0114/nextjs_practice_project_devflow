import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React, { Suspense } from "react";

import AnswerList from "@/components/answers/AnswerList";
import TagCard from "@/components/cards/TagCard";
import { Preview } from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import VoteCounter from "@/components/votes/VoteCounter";
import { DYNAMIC_ROUTES } from "@/constants/routes";
import { getAnwsers } from "@/lib/actions/answer.action";
import {
  getQuestionById,
  increaseQuestionViews,
} from "@/lib/actions/question.action";
import { getVoteState } from "@/lib/actions/vote.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { RouteParams, Tag } from "@/types/global";

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page } = await searchParams;
  const getQuestionResult = await getQuestionById({ questionId: id });

  after(async () => {
    await increaseQuestionViews({ questionId: id });
  });

  if (!getQuestionResult.success || !getQuestionResult.data) redirect("/404");

  const getAnswersResult = await getAnwsers({
    questionId: id,
    page: 1,
    pageSize: 10,
    filter: "latest",
  });

  const getVoteStatePromise = getVoteState({
    targetId: id,
    targetType: "question",
  });

  const {
    author,
    title,
    createdAt,
    answers,
    views,
    tags,
    content,
    _id,
    upvotes,
    downvotes,
  } = getQuestionResult.data;

  const renderAnswerList = () => {
    const { success } = getAnswersResult;

    if (!success) {
      if (getAnswersResult.error)
        return <AnswerList success={success} error={getAnswersResult.error} />;
    } else {
      if (getAnswersResult.data) {
        const { answers, totalAnswers, isNext } = getAnswersResult.data;
        return (
          <AnswerList
            success={success}
            data={answers}
            isNext={isNext}
            totalAnswers={totalAnswers}
            page={Number(page) ?? 1}
          />
        );
      }
    }
  };

  return (
    <>
      {/* header */}
      <section className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          {/* author */}
          {author && (
            <div className="flex items-center justify-start gap-1">
              <UserAvatar
                id={author._id}
                name={author.name || "Default"}
                image={author.image}
                className="size-[22px]"
                fallbackClassName="text-[10px]"
              />
              <Link href={DYNAMIC_ROUTES.PROFILE_DETAIL(author._id)}>
                <p className="paragraph-semibold text-dark300_light700">
                  {author.name}
                </p>
              </Link>
            </div>
          )}

          {/* votes & bookmark */}
          <div className="flex items-center justify-end gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <VoteCounter
                targetType="question"
                targetId={String(_id)}
                upvotes={upvotes}
                downvotes={downvotes}
                getVoteStatePromise={getVoteStatePromise}
              />
            </Suspense>
            <p>bookmark</p>
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </section>

      {/* metrics */}
      <section className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={formatNumber(answers)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </section>

      <Preview content={content} />

      {/* tags */}
      <section className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            isCompact
          />
        ))}
      </section>

      {/* answers */}
      <section className="my-5">{renderAnswerList()}</section>

      <section className="my-5">
        <AnswerForm
          questionId={String(_id)}
          questionTitle={title}
          questionContent={content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
