import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import ProfileLink from "@/components/user/ProfileLink";
import UserAvatar from "@/components/UserAvatar";
import { getUserById } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";

const Profile = async ({ params }: RouteParams) => {
  const { id } = await params;

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
    </>
  );
};

export default Profile;
