import z from "zod";

import {
  AskQuestionSchema,
  CreateAnswerSchema,
  CreateVoteSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  GetTagQuestionSchema,
  GetVoteStateSchema,
  IncreaseQuestionViewSchema,
  SignInWithOAuthSchema,
  SignUpSchema,
  UpdateVoteCountSchema,
} from "@/lib/validations";

// * ===== auth ===== * //

type SignInWithOAuthParams = z.infer<typeof SignInWithOAuthSchema>;

type AuthCredentials = z.infer<typeof SignUpSchema>;

// * ===== question ===== * //

type CreateQuestionParams = z.infer<typeof AskQuestionSchema>;

type EditQuestionParams = z.infer<typeof EditQuestionSchema>;

type GetQuestionParams = z.infer<typeof GetQuestionSchema>;

type GetTagQuestionsParams = z.infer<typeof GetTagQuestionSchema>;

type IncreaseQuestionViewParams = z.infer<typeof IncreaseQuestionViewSchema>;

// * ===== answer ===== * //

type CreateAnswerParams = z.infer<typeof CreateAnswerSchema>;

// * ===== vote ===== * //

type CreateVotesParams = z.infer<typeof CreateVoteSchema>;

type UpdateVoteCountParams = z.infer<typeof UpdateVoteCountSchema>;

type GetVoteStateParams = z.infer<typeof GetVoteStateSchema>;
// type GetVoteStatusParams = Pick<CreateVotesParams, "targetId" | "targetType">;
type VoteState = { state: "upvoted" | "downvoted" | "notVoted" }; // serve as response
