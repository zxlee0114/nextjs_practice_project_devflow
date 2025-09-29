import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { DYNAMIC_ROUTES } from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/state";
import { getTagQuestionsBySearchParams } from "@/lib/actions/tag.action";
import { RouteParams } from "@/types/global";

const TagQuestions = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page = 1, pageSize = 5 } = await searchParams;

  const result = await getTagQuestionsBySearchParams({
    tagId: id,
    page: Number(page),
    pageSize: Number(pageSize),
  });

  const { success } = result;

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          {success && result.data ? result.data.tag?.name : "Tag Questions"}
        </h1>
      </section>

      <section className="mt-11">
        <LocalSearch
          route={DYNAMIC_ROUTES.TAG_CONTENT(id)}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>

      {success ? (
        <DataRenderer
          success={success}
          data={result.data?.questions}
          empty={EMPTY_QUESTION}
          render={(questions) => (
            <div className="mt-10 flex w-full flex-col gap-6">
              {questions.map((question) => (
                <QuestionCard key={question._id} question={question} />
              ))}
            </div>
          )}
        />
      ) : (
        <DataRenderer
          success={success}
          empty={EMPTY_QUESTION}
          error={result.error}
        />
      )}

      {success && result.data && (
        <Pagination page={Number(page)} isNext={result.data.isNext || false} />
      )}
    </>
  );
};

export default TagQuestions;
