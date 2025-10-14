"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { formUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

type PaginationProps = {
  page: number | string | undefined;
  isNext: boolean;
  otherClasses?: string;
};

const Pagination = ({ page = 1, isNext, otherClasses }: PaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageNumber = Number(page) || 1;

  const handleNavigation = (buttonType: "prev" | "next") => {
    const nextPageNumber =
      buttonType === "prev" ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };
  return (
    <>
      <div className={cn("flex-center gap-2 mt-5", otherClasses)}>
        {/* Previous Page Button */}
        <Button
          onClick={() => handleNavigation("prev")}
          className="light-border-2 btn flex-center min-h-[36px] gap-2 border"
          disabled={pageNumber === 1}
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Button>

        {/* page text */}
        <div className="bg-primary-500 flex items-center justify-center rounded-md px-3.5 py-2">
          <p className="body-semibold text-light-900">{pageNumber}</p>
        </div>

        {/* Next Page Button */}
        <Button
          onClick={() => handleNavigation("next")}
          className="light-border-2 btn flex-center min-h-[36px] gap-2 border"
          disabled={!isNext}
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Button>
      </div>
    </>
  );
};

export default Pagination;
