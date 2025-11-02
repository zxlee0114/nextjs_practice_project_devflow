import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { TAccount, TAccountDoc } from "./database/account.model";
import { TUserDoc } from "./database/user.model";
import { api } from "./lib/api";
import { SignInSchema } from "./lib/validations";
import { ActionResponse, SuccessResponse } from "./types/global";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as SuccessResponse<TAccountDoc>;
          if (!existingAccount) return null;

          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as SuccessResponse<TUserDoc>;
          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );
          if (isValidPassword) {
            const { id, name, email, image } = existingUser;

            return { id, name, email, image };
          }
        }

        // validating fields fails => new user
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as SuccessResponse<TAccount>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }
      return token;
    },
    async signIn({ user, profile, account }) {
      console.log("🔍 SignIn callback triggered", {
        accountType: account?.type,
        provider: account?.provider,
      });

      if (account?.type === "credentials") return true;
      if (!account || !user) {
        console.log("❌ Missing account or user");
        return false;
      }

      console.log("📤 Calling oAuthSignIn API...", {
        provider: account.provider,
      });
      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLocaleLowerCase() as string),
      };

      const response = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!response.success) {
        console.error("❌ oAuthSignIn failed:", response);
        return false;
      }

      console.log("✅ SignIn successful");
      return true;
    },
  },
});
