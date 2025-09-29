import React from "react";

import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { TagFilters } from "@/constants/filter";
import ROUTES from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/state";
import { getTagsBySearchParams } from "@/lib/actions/tag.action";
import { RouteParams } from "@/types/global";

const Tags = async ({ searchParams }: RouteParams) => {
  const { page = 1, pageSize = 9, query, filter } = await searchParams;

  const result = await getTagsBySearchParams({
    page: Number(page),
    pageSize: Number(pageSize),
    query,
    filter,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      {result.success ? (
        <DataRenderer
          success={result.success}
          data={result.data?.tags}
          empty={EMPTY_TAGS}
          render={(tags) => (
            <div className="mt-10 flex w-full flex-wrap gap-4">
              {tags.map((tag) => (
                <TagCard key={tag._id} {...tag} />
              ))}
            </div>
          )}
        />
      ) : (
        // error state
        <DataRenderer
          success={result.success}
          empty={EMPTY_TAGS}
          error={result.error}
        />
      )}

      {result.success && result.data && (
        <Pagination page={page} isNext={result.data.isNext || false} />
      )}
    </>
  );
};

export default Tags;
