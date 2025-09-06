import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";

import NavLinks from "./NavLinks";

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/icons/hamburger.svg"
          alt="Menu"
          width={36}
          height={36}
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none"
      >
        <SheetHeader>
          <SheetTitle className="hidden">Navigation</SheetTitle>
          <SheetDescription className="hidden">
            Navigation Menu
          </SheetDescription>
          <Link href={ROUTES.HOME} className="flex items-center gap-1">
            <Image
              src="/images/site-logo.svg"
              alt="DevFlow Logo"
              className="flex items-center gap-1"
              width={23}
              height={23}
            />
            <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
              Dev
              <span className="text-primary-500">Flow</span>
            </p>
          </Link>
        </SheetHeader>
        <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto px-4">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              <NavLinks isMobileNav={true} />
            </section>
          </SheetClose>
        </div>
        <div className="flex flex-col gap-3 px-4">
          <SheetClose asChild>
            <Link href={ROUTES.SIGN_IN}>
              <button className="small-medium btn-secondary min-h-[41px] w-full cursor-pointer rounded-lg px-4 py-3 shadow-none">
                <span className="primary-text-gradient">Log In</span>
              </button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href={ROUTES.SIGN_UP}>
              <button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full cursor-pointer rounded-lg border px-4 py-3 shadow-none">
                Sign Up
              </button>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
