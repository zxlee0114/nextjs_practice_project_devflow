import Image from "next/image";
import Link from "next/link";
import React from "react";

import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/state";

import { Button } from "./ui/button";

type SuccessState<T> = {
  success: true;
  data: T[] | undefined | null;
  render: (data: T[]) => React.ReactNode;
};

type ErrorState = {
  success: false;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
};

type DataRendererProps<T> = {
  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
} & (SuccessState<T> | ErrorState);

type StateSkeletonProps = {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
};

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => {
  return (
    <section className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
      <>
        <Image
          src={image.dark}
          alt={image.alt}
          width={270}
          height={200}
          className="hidden object-contain dark:block"
        />
        <Image
          src={image.light}
          alt={image.alt}
          width={270}
          height={200}
          className="block object-contain dark:hidden"
        />
      </>

      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {message}
      </p>
      {button && (
        <Link href={button.href}>
          <Button className="paragraph-medium bg-primary-500 text-light-900 hover:bg-primary-500 mt-5 min-h-[46px] rounded-lg px-4 py-3">
            {button.text}
          </Button>
        </Link>
      )}
    </section>
  );
};

const DataRenderer = <T,>({
  empty = DEFAULT_EMPTY,
  ...rest
}: DataRendererProps<T>) => {
  // error state
  if (!rest.success) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-error.png",
          dark: "/images/dark-error.png",
          alt: "Error state illustration",
        }}
        title={rest.error?.message || DEFAULT_ERROR.title}
        message={
          rest.error?.details
            ? JSON.stringify(rest.error?.details, null, 2)
            : DEFAULT_ERROR.message
        }
        button={empty.button}
      />
    );
  }

  const { data, render } = rest;

  // empty state
  if (!data || data.length === 0) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  // display data
  return <section>{render(data)}</section>;
};

export default DataRenderer;
