import Link from "next/link";
import React, { Suspense } from "react";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { getVoteState } from "@/lib/actions/vote.action";
import { cn, getTimeStamp } from "@/lib/utils";
import { Answer } from "@/types/global";

import { Preview } from "../editor/Preview";
import ActionButtons from "../user/ActionButtons";
import UserAvatar from "../UserAvatar";
import VoteCounter from "../votes/VoteCounter";

interface AnswerCardProps extends Answer {
  containerClasses?: string;
  showReadMore?: boolean;
  showActionBtns: boolean;
}

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  question,
  containerClasses,
  showReadMore = false,
  showActionBtns = false,
}: AnswerCardProps) => {
  const getVoteStatePromise = getVoteState({
    targetId: _id,
    targetType: "answer",
  });
  return (
    <article
      className={cn("light-border border-b py-10 relative", containerClasses)}
    >
      <span id={`answer-${_id}`} className="hash-span" />

      {showActionBtns && (
        <div className="background-light800 flex-center absolute -top-5 -right-2 size-9 rounded-full">
          <ActionButtons type="answer" targetId={_id} />
        </div>
      )}

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            image={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />

          <Link
            href={DYNAMIC_ROUTES.PROFILE_DETAIL(author._id)}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>

            <p className="flex-center small-regular text-light400_light500 mt-0.5 ml-0.5 line-clamp-1">
              <span className="max-sm:hidden"> • </span>
              <span> answered {getTimeStamp(createdAt)}</span>
            </p>
          </Link>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Suspense fallback={<div>Loading...</div>}>
            <VoteCounter
              targetType="answer"
              targetId={String(_id)}
              upvotes={upvotes}
              downvotes={downvotes}
              getVoteStatePromise={getVoteStatePromise}
            />
          </Suspense>
        </div>
      </div>

      <Preview content={content} />

      {showReadMore && (
        <Link
          href={`/questions/${question}#answer-${_id}`}
          className="body-semibold font-space-grotesk text-primary-500 relative z-10"
        >
          <p className="mt-1">Read more...</p>
        </Link>
      )}
    </article>
  );
};

export default AnswerCard;
