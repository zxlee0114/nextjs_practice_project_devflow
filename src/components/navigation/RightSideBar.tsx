import Image from "next/image";
import Link from "next/link";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { getTopQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";

import TagCard from "../cards/TagCard";
import DataRenderer from "../DataRenderer";

const EMPTY_STATE = {
  TOP_QUESTIONS: {
    title: "No questions found",
    message: "No questions have been asked yet.",
  },
  TOP_TAGS: {
    title: "No tags found",
    message: "No tags have been created yet.",
  },
};

const RightSideBar = async () => {
  const [topQuestionsResponse, topTagsResponse] = await Promise.all([
    getTopQuestions({ limit: 5 }),
    getTopTags({ limit: 5 }),
  ]);

  return (
    <aside className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-[350px] flex-col  gap-6 overflow-y-auto border-l p-6 pt-36 max-lg:hidden dark:shadow-none">
      <section>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        {topQuestionsResponse.success ? (
          <DataRenderer
            success={topQuestionsResponse.success}
            data={topQuestionsResponse.data}
            empty={EMPTY_STATE.TOP_QUESTIONS}
            render={(topQuestions) => (
              <div className="mt-7 flex w-full flex-col gap-[30px]">
                {topQuestions.map(({ _id, title }) => (
                  <Link
                    key={_id}
                    href={DYNAMIC_ROUTES.QUESTION_DETAIL(_id)}
                    className="flex cursor-pointer items-center justify-between gap-7"
                  >
                    <p className="body-medium text-dark500_light700 line-clamp-2">
                      {title}
                    </p>

                    <Image
                      src="/icons/chevron-right.svg"
                      alt="Chevron"
                      width={20}
                      height={20}
                      className="invert-colors"
                    />
                  </Link>
                ))}
              </div>
            )}
          />
        ) : (
          <DataRenderer
            success={topQuestionsResponse.success}
            error={topQuestionsResponse.error}
            empty={EMPTY_STATE.TOP_QUESTIONS}
          />
        )}
      </section>
      <section className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        {topTagsResponse.success ? (
          <DataRenderer
            success={topTagsResponse.success}
            data={topTagsResponse.data}
            empty={EMPTY_STATE.TOP_TAGS}
            render={(topTags) => (
              <div className="mt-7 flex flex-col gap-4">
                {topTags.map(({ _id, name, questionCount }) => (
                  <TagCard
                    key={_id}
                    _id={_id}
                    name={name}
                    questionCount={questionCount}
                    showCount
                    isCompact
                  />
                ))}
              </div>
            )}
          />
        ) : (
          <DataRenderer
            success={topTagsResponse.success}
            error={topTagsResponse.error}
            empty={EMPTY_STATE.TOP_TAGS}
          />
        )}
      </section>
    </aside>
  );
};

export default RightSideBar;
