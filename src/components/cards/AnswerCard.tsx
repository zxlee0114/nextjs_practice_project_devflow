import Link from "next/link";
import React from "react";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import { Answer } from "@/types/global";

import { Preview } from "../editor/Preview";
import UserAvatar from "../UserAvatar";

const AnswerCard = ({ _id, author, content, createdAt }: Answer) => {
  console.log({ _id });
  return (
    <article className="light-border border-b py-10">
      <span id={`answer-${_id}`} className="hash-span" />

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

        <div className="flex justify-end">Votes</div>
      </div>

      <Preview content={content} />
    </article>
  );
};

export default AnswerCard;
