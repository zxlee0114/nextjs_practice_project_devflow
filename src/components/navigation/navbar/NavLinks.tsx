"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { SheetClose } from "@/components/ui/sheet";
import { NAV_LIST } from "@/constants";
import { cn } from "@/lib/utils";

const NavLinks = ({
  isMobileNav = false,
  userId,
}: {
  isMobileNav?: boolean;
  userId?: string;
}) => {
  const pathname = usePathname();

  return (
    <>
      {NAV_LIST.map((navItem) => {
        const isActive =
          (pathname.includes(navItem.route) && navItem.route.length > 1) ||
          pathname === navItem.route;

        const href =
          navItem.route === "/profile" && userId
            ? `/profile/${userId}`
            : navItem.route;

        if (navItem.route === "/profile" && !userId) return null;

        const LinkComponent = (
          <Link
            href={href}
            key={navItem.label}
            className={cn(
              isActive
                ? "primary-gradient rounded-lg text-light-900"
                : "text-dark300_light900",
              "flex items-center justify-start gap-4 p-4"
            )}
          >
            <Image
              src={navItem.imgURL}
              alt={navItem.label}
              width={20}
              height={20}
              className={cn({ "invert-colors": !isActive })}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobileNav && "max-lg:hidden"
              )}
            >
              {navItem.label}
            </p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={href}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={navItem.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
