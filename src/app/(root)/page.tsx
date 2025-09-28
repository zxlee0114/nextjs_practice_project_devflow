import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/state";
import { getQuestionsBySearchParams } from "@/lib/actions/question.action";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>;
};

const Homepage = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const result = await getQuestionsBySearchParams({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  // if (result.success && result.data) {
  //   const { questions } = result.data; // TODO: isNext for paginantion

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient !text-light-900 min-h-[46px] px-4 py-3"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          placeholder="Search Questions..."
          imgSrc="/icons/search.svg"
          otherClasses="flex-1"
        />
        <HomeFilter />
      </section>

      {result.success ? (
        <DataRenderer
          success={result.success}
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
        // error state
        <DataRenderer
          success={result.success}
          empty={EMPTY_QUESTION}
          error={result.error}
        />
      )}
    </>
  );
};

export default Homepage;
