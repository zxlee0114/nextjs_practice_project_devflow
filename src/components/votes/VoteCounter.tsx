"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { use, useState } from "react";
import { toast } from "sonner";

import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { VoteState } from "@/types/action";
import { ActionResponse } from "@/types/global";

type voteParams = {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;
  downvotes: number;
  getVoteStatePromise: Promise<ActionResponse<VoteState>>;
};

const VoteCounter = ({
  targetType,
  targetId,
  upvotes = 0,
  downvotes = 0,
  getVoteStatePromise,
}: voteParams) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const [isLoading, setIsLoading] = useState(false);

  const voteStateResult = use(getVoteStatePromise);
  const { success } = voteStateResult;

  let voteState;

  if (voteStateResult.success && voteStateResult.data) {
    voteState = voteStateResult.data.state;
  }

  const hasUpvoted = voteState === "upvoted";
  const hasDownvoted = voteState === "downvoted";

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId)
      return toast.info("Please login to vote", {
        description: "Only logged-in users can vote.",
      });

    setIsLoading(true);

    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        return toast.error("Failed to Vote", {
          description:
            result.error?.message ??
            "An error occured while voting. Please try again later",
        });
      }

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;
      toast.success(successMessage, {
        description: "Your vote has been recorded.",
      });
    } catch {
      toast("Failed to vote", {
        description: "An error occurred while voting. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          width={18}
          height={18}
          alt="downvoted"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoteCounter;
