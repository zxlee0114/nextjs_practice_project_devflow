import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { Question } from "@/types/global";

const questions: Question[] = [
  {
    _id: "1",
    title: "How to learn React?",
    content: "...",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
    ],
    author: {
      _id: "1",
      name: "Yee",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    createdAt: new Date(),
    upvotes: 10,
    answers: 4,
    views: 188,
  },
  {
    _id: "2",
    title: "How to learn JavaScript?",
    content: "...",
    tags: [{ _id: "2", name: "Javascript" }],
    author: {
      _id: "2",
      name: "Yeee",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    createdAt: new Date(),
    upvotes: 20,
    answers: 45,
    views: 345,
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
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </section>
    </>
  );
};

export default Homepage;
