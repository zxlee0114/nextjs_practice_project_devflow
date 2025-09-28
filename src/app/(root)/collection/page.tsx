import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/state";
import { getSavedQuestionsBySearchParams } from "@/lib/actions/collection.action";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>;
};

const Collection = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const result = await getSavedQuestionsBySearchParams({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.COLLECTION}
          placeholder="Search Questions..."
          imgSrc="/icons/search.svg"
          otherClasses="flex-1"
        />
      </section>

      {result.success ? (
        <DataRenderer
          success={result.success}
          data={result.data?.collection}
          empty={EMPTY_QUESTION}
          render={(collection) => (
            <div className="mt-10 flex w-full flex-col gap-6">
              {collection.map((saved) => (
                <QuestionCard key={saved._id} question={saved.question} />
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

export default Collection;
