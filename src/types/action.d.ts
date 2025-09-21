import z from "zod";

import { SignInWithOAuthSchema, SignUpSchema } from "@/lib/validations";

type SignInWithOAuthParams = z.infer<typeof SignInWithOAuthSchema>;

type AuthCredentials = z.infer<typeof SignUpSchema>;
