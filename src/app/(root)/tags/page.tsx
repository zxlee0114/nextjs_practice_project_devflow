import React from "react";

import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/state";
import { getTagsBySearchParams } from "@/lib/actions/tag.action";
import { RouteParams } from "@/types/global";

const Tags = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const result = await getTagsBySearchParams({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
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
    </>
  );
};

export default Tags;
