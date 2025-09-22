import z from "zod";

import {
  AskQuestionSchema,
  SignInWithOAuthSchema,
  SignUpSchema,
} from "@/lib/validations";

type SignInWithOAuthParams = z.infer<typeof SignInWithOAuthSchema>;

type AuthCredentials = z.infer<typeof SignUpSchema>;

type CreateQuestionParams = z.infer<typeof AskQuestionSchema>;
