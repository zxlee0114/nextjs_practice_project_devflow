import Image from "next/image";
import Link from "next/link";

import { DYNAMIC_ROUTES } from "@/constants/routes";

import TagCard from "../cards/TagCard";

const topQuestions = [
  {
    _id: "1",
    title: "What is React?",
  },
  {
    _id: "2",
    title: "How to use TypeScript with React?",
  },
  {
    _id: "3",
    title: "What are React hooks?",
  },
  {
    _id: "4",
    title: "How to manage state in React?",
  },
  {
    _id: "5",
    title: "What is the Virtual DOM?",
  },
];

const popularTags = [
  {
    _id: "1",
    name: "javascript",
    questions: 1200,
  },
  {
    _id: "2",
    name: "react",
    questions: 900,
  },
  {
    _id: "3",
    name: "typescript",
    questions: 800,
  },
  {
    _id: "4",
    name: "nodejs",
    questions: 700,
  },
  {
    _id: "5",
    name: "css",
    questions: 600,
  },
];

const RightSideBar = () => {
  return (
    <aside className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-[350px] flex-col  gap-6 overflow-y-auto border-l p-6 pt-36 max-lg:hidden dark:shadow-none">
      <section>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {topQuestions.map(({ _id, title }) => (
            <Link
              key={_id}
              href={DYNAMIC_ROUTES.QUESTION_DETAIL(_id)}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{title}</p>
              <Image
                src="/icons/chevron-right.svg"
                alt="arrow"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </section>
      <section className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex w-full flex-col gap-4">
          {popularTags.map(({ _id, name, questions }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              isCompact
            />
          ))}
        </div>
      </section>
    </aside>
  );
};

export default RightSideBar;
