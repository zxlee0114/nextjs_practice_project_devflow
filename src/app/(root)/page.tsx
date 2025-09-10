import Link from "next/link";

import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const questions = [
  {
    _id: "1",
    title: "How to learn React?",
    description: "...",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
    ],
    author: { _id: "1", name: "Yee" },
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to learn JavaScript?",
    description: "...",
    tags: [{ _id: "2", name: "Javascript" }],
    author: { _id: "2", name: "Yeee" },
    createdAt: new Date(),
  },
];

type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>;
};

const Homepage = async ({ searchParams }: SearchParams) => {
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter = filter
      ? question.tags[0].name.toLowerCase() === filter.toLowerCase()
      : true;
    return matchesQuery && matchesFilter;
  });

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
      <section className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map(({ title, _id }) => (
          <h1 key={_id}>{title}</h1>
        ))}
      </section>
    </>
  );
};

export default Homepage;
