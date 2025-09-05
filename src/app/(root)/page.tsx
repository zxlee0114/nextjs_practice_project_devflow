import React from "react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Homepage = async () => {
  const session = await auth();
  console.log(session);
  return (
    <>
      <h1 className="pt-[100px] text-3xl font-bold underline">
        Hi, {session?.user?.name || "Guest"}!
      </h1>
      <form
        className="pt-4"
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button type="submit">Logout</Button>
      </form>
    </>
  );
};

export default Homepage;
