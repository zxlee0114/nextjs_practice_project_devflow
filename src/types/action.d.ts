import z from "zod";

import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  SignInWithOAuthSchema,
  SignUpSchema,
} from "@/lib/validations";

type SignInWithOAuthParams = z.infer<typeof SignInWithOAuthSchema>;

type AuthCredentials = z.infer<typeof SignUpSchema>;

type CreateQuestionParams = z.infer<typeof AskQuestionSchema>;

type EditQuestionParams = z.infer<typeof EditQuestionSchema>;

type GetQuestionParams = z.infer<typeof GetQuestionSchema>;
