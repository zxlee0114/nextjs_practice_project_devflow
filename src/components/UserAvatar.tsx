import Image from "next/image";
import Link from "next/link";
import React from "react";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "./ui/avatar";
type UserAvatarProps = {
  id: string;
  name: string;
  image?: string | null;
  className?: string;
  fallbackClassName?: string;
};

const UserAvatar = ({
  id,
  name,
  image,
  className = "h-9 w-9",
  fallbackClassName,
}: UserAvatarProps) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={DYNAMIC_ROUTES.PROFILE_DETAIL(id)}>
      <Avatar className={cn("relative", className)}>
        {image ? (
          <Image
            src={image}
            alt={name}
            className="object-cover"
            width={36}
            height={36}
            quality={100}
          />
        ) : (
          <AvatarFallback
            className={cn(
              "primary-gradient font-space-grotesk font-bold tracking-wider text-white",
              fallbackClassName
            )}
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
