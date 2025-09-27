import Link from "next/link";
import React from "react";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { UserWithMeta } from "@/database/user.model";

import UserAvatar from "../UserAvatar";

type UserCardProps = Pick<UserWithMeta, "_id" | "name" | "image" | "username">;

const UserCard = ({ _id, name, image, username }: UserCardProps) => {
  return (
    <div className="shadow-light100_darknone xs:w-[230px] w-full">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <UserAvatar
          id={_id}
          name={name}
          image={image}
          className="size-[100px] rounded-full object-cover"
          fallbackClassName="text-3xl tracking-widest"
        />

        <Link href={DYNAMIC_ROUTES.PROFILE_DETAIL(_id)}>
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              @{username}
            </p>
          </div>
        </Link>
      </article>
    </div>
  );
};

export default UserCard;
