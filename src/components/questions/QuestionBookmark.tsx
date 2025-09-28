"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";

const QuestionBookmark = ({ questionId }: { questionId: string }) => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId)
      return toast.info("You need to be logged in to save a question");

    setIsLoading(true);

    try {
      const result = await toggleSaveQuestion({ questionId });
      if (!result.success)
        throw new Error(
          result.error?.message || "An error occurred. Please try again"
        );

      toast.success(
        `Question ${result.data?.saved ? "saved" : "unsaved"} successfully`
      );
    } catch (error) {
      toast.error("Error", {
        description: `${error instanceof Error ? error.message : "An error occurred. Please try again"}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasSaved = false;
  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      aria-label="Save question"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      onClick={handleSave}
    />
  );
};

export default QuestionBookmark;
