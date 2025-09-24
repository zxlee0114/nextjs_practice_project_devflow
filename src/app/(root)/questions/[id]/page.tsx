import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import TagCard from "@/components/cards/TagCard";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import { DYNAMIC_ROUTES } from "@/constants/routes";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { RouteParams, Tag } from "@/types/global";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  const getQuestionResult = await getQuestionById({ questionId: id });

  if (!getQuestionResult.success) redirect("/404");
  if (!getQuestionResult.data) return;
  const { author, title, createdAt, answers, views, tags, content } =
    getQuestionResult.data;
  console.log({ Question: getQuestionResult.data });

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
            <p>Votes</p>
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

      <section>{content}</section>

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
      <section className="my-5">{answers}</section>

      <section className="my-5">
        <p>AnswerForm</p>
      </section>
    </>
  );
};

export default QuestionDetails;
