import z from "zod";

import {
  AskQuestionSchema,
  CreateAnswerSchema,
  CreateVoteSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  GetTagQuestionSchema,
  IncreaseQuestionViewSchema,
  SignInWithOAuthSchema,
  SignUpSchema,
  UpdateVoteCountSchema,
} from "@/lib/validations";

type SignInWithOAuthParams = z.infer<typeof SignInWithOAuthSchema>;

type AuthCredentials = z.infer<typeof SignUpSchema>;

type CreateQuestionParams = z.infer<typeof AskQuestionSchema>;

type EditQuestionParams = z.infer<typeof EditQuestionSchema>;

type GetQuestionParams = z.infer<typeof GetQuestionSchema>;

type GetTagQuestionsParams = z.infer<typeof GetTagQuestionSchema>;

type IncreaseQuestionViewParams = z.infer<typeof IncreaseQuestionViewSchema>;

type CreateAnswerParams = z.infer<typeof CreateAnswerSchema>;

type CreateVotesParams = z.infer<typeof CreateVoteSchema>;

type UpdateVoteCountParams = z.infer<typeof UpdateVoteCountSchema>;
