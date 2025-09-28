import React from "react";

import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { UserFilters } from "@/constants/filter";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/state";
import { getUsersBySearchParams } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const result = await getUsersBySearchParams({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { success } = result;

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="There are some great devs here!"
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      {success ? (
        <DataRenderer
          success={success}
          empty={EMPTY_USERS}
          data={result.data?.users}
          render={(users) => (
            <div className="mt-12 flex flex-wrap gap-5">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  _id={user._id}
                  image={user.image}
                  name={user.name}
                  username={user.username}
                />
              ))}
            </div>
          )}
        />
      ) : (
        <DataRenderer
          success={success}
          empty={EMPTY_USERS}
          error={result.error}
        />
      )}
    </div>
  );
};

export default Community;
