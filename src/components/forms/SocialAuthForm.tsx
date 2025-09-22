"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

import ROUTES from "@/constants/routes";

import { Button } from "../ui/button";

const SocialAuthForm = () => {
  const socialButtonStyles =
    "background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1 px-4 py-3.5 cursor-pointer";

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      // console.log("Signing in with", provider);
      await signIn(provider, { callbackUrl: ROUTES.HOME, redirect: true });
    } catch (error) {
      // console.error("Error during social sign-in:", error);
      toast.error("Sign-in Failed", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during sign-in.",
      });
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button
        className={socialButtonStyles}
        onClick={() => handleSignIn("github")}
      >
        <Image
          src="/icons/github.svg"
          alt="GitHub Logo"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Login with Github</span>
      </Button>
      <Button
        className={socialButtonStyles}
        onClick={() => handleSignIn("google")}
      >
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Login with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
