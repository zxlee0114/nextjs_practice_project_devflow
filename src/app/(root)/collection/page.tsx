import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { CollectionFilters } from "@/constants/filter";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/state";
import { getSavedQuestionsBySearchParams } from "@/lib/actions/collection.action";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>;
};

const Collection = async ({ searchParams }: SearchParams) => {
  const { page = 1, pageSize = 5, query, filter } = await searchParams;

  const result = await getSavedQuestionsBySearchParams({
    page: Number(page),
    pageSize: Number(pageSize),
    query: query || "",
    filter: filter || "",
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COLLECTION}
          placeholder="Search Questions..."
          imgSrc="/icons/search.svg"
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={CollectionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
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

      {result.success && result.data && (
        <Pagination page={page} isNext={result.data.isNext || false} />
      )}
    </>
  );
};

export default Collection;
