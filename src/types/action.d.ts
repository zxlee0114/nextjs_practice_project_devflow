import z from "zod";

import {
  AskQuestionSchema,
  CollectionBaseSchema,
  CreateAnswerSchema,
  CreateVoteSchema,
  DeleteAnswerSchema,
  DeleteQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  GetTagQuestionSchema,
  GetUserAnswersSchema,
  GetUserByIdSchema,
  GetUserQuestionsSchema,
  GetUserTopTagsSchema,
  GetVoteStateSchema,
  IncreaseQuestionViewSchema,
  SignInWithOAuthSchema,
  SignUpSchema,
  UpdateVoteCountSchema,
} from "@/lib/validations";

// * ===== auth & user ===== * //

type SignInWithOAuthParams = z.infer<typeof SignInWithOAuthSchema>;

type AuthCredentials = z.infer<typeof SignUpSchema>;

type GetUserByIdParams = z.infer<typeof GetUserByIdSchema>;

type GetUserQuestionsParams = z.infer<typeof GetUserQuestionsSchema>;

type GetUserAnswersParams = z.infer<typeof GetUserAnswersSchema>;

type GetUserTopTagsParams = z.infer<typeof GetUserTopTagsSchema>;

// * ===== question ===== * //

type CreateQuestionParams = z.infer<typeof AskQuestionSchema>;

type EditQuestionParams = z.infer<typeof EditQuestionSchema>;

type GetQuestionParams = z.infer<typeof GetQuestionSchema>;

type DeleteQuestionParams = z.infer<typeof DeleteQuestionSchema>;

type GetTagQuestionsParams = z.infer<typeof GetTagQuestionSchema>;

type IncreaseQuestionViewParams = z.infer<typeof IncreaseQuestionViewSchema>;

type CollectionBaseParams = z.infer<typeof CollectionBaseSchema>;

// * ===== answer ===== * //

type CreateAnswerParams = z.infer<typeof CreateAnswerSchema>;

type DeleteAnswerParams = z.infer<typeof DeleteAnswerSchema>;

// * ===== vote ===== * //

type CreateVotesParams = z.infer<typeof CreateVoteSchema>;

type UpdateVoteCountParams = z.infer<typeof UpdateVoteCountSchema>;

type GetVoteStateParams = z.infer<typeof GetVoteStateSchema>;
// type GetVoteStatusParams = Pick<CreateVotesParams, "targetId" | "targetType">;
type VoteState = { state: "upvoted" | "downvoted" | "notVoted" }; // serve as response
