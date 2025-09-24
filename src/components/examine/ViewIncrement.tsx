"use client";
import { useEffect } from "react";

import { increaseQuestionViews } from "@/lib/actions/question.action";

const ViewIncrement = ({ questionId }: { questionId: string }) => {
  useEffect(() => {
    const handleIncrement = async () => {
      const result = await increaseQuestionViews({ questionId });
      console.log({ result });
    };

    handleIncrement();
  }, [questionId]);

  return null;
};

export default ViewIncrement;
