import { AnswerFilters } from "@/constants/filter";
import { EMPTY_ANSWERS } from "@/constants/state";
// import { getTimeStamp } from "@/lib/utils";
import { Answer } from "@/types/global";

import AnswerCard from "../cards/AnswerCard";
import DataRenderer from "../DataRenderer";
import CommonFilter from "../filters/CommonFilter";

type SuccessProps = {
  success: true;
  page: number;
  isNext: boolean;
  totalAnswers: number;
  data: Answer[] | undefined | null;
};

type ErrorProps = {
  success: false;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
};

type AnswerListProp = SuccessProps | ErrorProps;

const AnswerList = (props: AnswerListProp) => {
  return (
    <div className="mt-11">
      {props.success && (
        <div className="flex items-center justify-between">
          <h3 className="primary-text-gradient">
            {props.totalAnswers}{" "}
            {props.totalAnswers === 1 ? "Answer" : "Answers"}
          </h3>

          <CommonFilter
            filters={AnswerFilters}
            otherClasses="sm:min-w-32"
            containerClasses="max-xs:w-full"
          />
        </div>
      )}

      {props.success ? (
        <DataRenderer
          success={props.success}
          data={props.data}
          empty={EMPTY_ANSWERS}
          render={(answers) =>
            answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)
          }
        />
      ) : (
        <DataRenderer
          success={props.success}
          empty={EMPTY_ANSWERS}
          error={props.error}
        />
      )}
    </div>
  );
};

export default AnswerList;
