import z from "zod";

import ROUTES from "@/constants/routes";
import { TAccount } from "@/database/account.model";
import { TUser } from "@/database/user.model";

import { fetchHandler } from "./handlers/fetch";
import { SignInWithOAuthSchema } from "./validations";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const users = {
  getAll: () => fetchHandler(`${API_BASE_URL}/users`),
  getById: (userId: string) => fetchHandler(`${API_BASE_URL}/users/${userId}`),
  getByEmail: (email: string) =>
    fetchHandler(`${API_BASE_URL}/users/email`, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  create: (userData: Partial<TUser>) =>
    fetchHandler(`${API_BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  update: (userId: string, userData: Partial<TUser>) =>
    fetchHandler(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  delete: (userId: string) =>
    fetchHandler(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
    }),
};

const accounts = {
  getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
  getById: (accountId: string) =>
    fetchHandler(`${API_BASE_URL}/accounts/${accountId}`),
  getByProvider: (providerAccountId: string) =>
    fetchHandler(`${API_BASE_URL}/accounts/provider`, {
      method: "POST",
      body: JSON.stringify({ providerAccountId }),
    }),
  create: (accountData: Partial<TAccount>) =>
    fetchHandler(`${API_BASE_URL}/accounts`, {
      method: "POST",
      body: JSON.stringify(accountData),
    }),
  update: (accountId: string, accountData: Partial<TAccount>) =>
    fetchHandler(`${API_BASE_URL}/accounts/${accountId}`, {
      method: "PUT",
      body: JSON.stringify(accountData),
    }),
  delete: (accountId: string) =>
    fetchHandler(`${API_BASE_URL}/accounts/${accountId}`, {
      method: "DELETE",
    }),
};

const auth = {
  oAuthSignIn: ({
    user,
    provider,
    providerAccountId,
  }: z.infer<typeof SignInWithOAuthSchema>) =>
    fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGNIN_WITH_OAUTH}`, {
      method: "POST",
      body: JSON.stringify({ user, provider, providerAccountId }),
    }),
};

export const api = {
  users,
  accounts,
  auth,
};
