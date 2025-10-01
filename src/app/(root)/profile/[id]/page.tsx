import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import UserAvatar from "@/components/UserAvatar";
import { EMPTY_QUESTION } from "@/constants/state";
import { getUserById, getUserQuestions } from "@/lib/actions/user.action";
import { GetUserQuestionsParams } from "@/types/action";
import { RouteParams } from "@/types/global";

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page = 1, pageSize = 10 } = await searchParams;

  if (!id) notFound();

  const loggedInUser = await auth();

  const result = await getUserById({ userId: id });

  if (!result.success)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="h1-bold text-dark100_light900">User not found</h1>
        <p className="paragraph-regular text-dark200_light800 max-w-md">
          {result.error?.message}
        </p>
      </div>
    );

  const { user, totalAnswers, totalQuestions } = result.data!;
  const { _id, name, image, username, portfolio, location, bio, createdAt } =
    user;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            image={image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl font-bolder"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  icon="/icons/link.svg"
                  href={portfolio}
                  title="Portfolio"
                />
              )}
              {location && (
                <ProfileLink icon="/icons/link.svg" title="Location" />
              )}
              <ProfileLink
                icon="/icons/calendar.svg"
                title={dayjs(createdAt).format("MMMM YYYY")}
              />
            </div>

            {bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link href="/profile/edit">
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{
          GOLD: 0,
          SILVER: 0,
          BRONZE: 0,
        }}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionList
              userId={id}
              page={Number(page)}
              pageSize={Number(pageSize)}
            />
          </TabsContent>

          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            Answers
          </TabsContent>
        </Tabs>

        <aside className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tags</h3>
          <div className="mt-7 flex flex-col gap-4">Tags</div>
        </aside>
      </section>
    </>
  );
};

export default Profile;

const QuestionList = async ({
  userId,
  page,
  pageSize,
}: GetUserQuestionsParams) => {
  const result = await getUserQuestions({
    userId,
    page,
    pageSize,
  });

  const { success } = result;

  return (
    <>
      {success ? (
        <>
          <DataRenderer
            success={success}
            data={result.data?.questions}
            empty={EMPTY_QUESTION}
            render={(questions) => (
              <div className="flex w-full flex-col gap-6">
                {questions.map((question) => (
                  <QuestionCard key={question._id} question={question} />
                ))}
              </div>
            )}
          />

          <Pagination page={page} isNext={result.data?.isNext || false} />
        </>
      ) : (
        <DataRenderer
          success={success}
          empty={EMPTY_QUESTION}
          error={result.error}
        />
      )}
    </>
  );
};
