"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

type Filter = "react" | "javascript";
// type Filter = "newest" | "popular" | "unanswered" | "recommended";

const filters = [
  { name: "React", value: "react" },
  { name: "Javascript", value: "javascript" },
  //   { name: "Newest", value: "newest" },
  //   { name: "Popular", value: "popular" },
  //   { name: "Unanswered", value: "unanswered" },
  //   { name: "Recommended", value: "recommended" },
];

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParams = searchParams.get("filter") || "";
  const [active, setActive] = useState(filterParams);

  const handleTypeClick = (filter: Filter) => {
    let newUrl;

    if (filter === active) {
      setActive("");
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      setActive(filter);

      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
    }
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map(({ name, value }) => (
        <Button
          key={name}
          onClick={() => handleTypeClick(value as Filter)}
          className={cn(
            `body-medium rounded-lg px-6 py-3 capitalize shadow-none cursor-pointer`,
            active === value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          )}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
