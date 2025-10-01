import { NextResponse } from "next/server";
import z from "zod";

import {
  GetAnswersSchema,
  PaginatedSearchParamsSchema,
  UserSchema,
} from "@/lib/validations";

// * ===== Data ===== * //
type Tag = {
  _id: string;
  name: string;
  questionCount?: number;
};

type Author = {
  _id: string;
  name: string;
  image: string;
};

type Question = {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
};

type Answer = {
  _id: string;
  author: Author;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  question: string;
};

type User = z.infer<typeof UserSchema> & {
  _id: string;
  createdAt: Date;
};

type Collection = {
  _id: string;
  author: string | Author;
  question: Question;
};

type BadgeCounts = {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
};

// * ===== Response (JSON Payload) ====== * //
type SuccessResponse<T> = {
  success: true;
  data?: T;
};

type ErrorResponse = {
  success: false;
  error: {
    message: string;
    details: Record<string, string[]>;
  };
  status: number;
};

type ActionResponse<T = null> = SuccessResponse<T> | ErrorResponse;

// * ===== server response ===== * //
type APIErrorResponse = NextResponse<ErrorResponse>;

type APIResponse<T = null> =
  | NextResponse<SuccessResponse<T>>
  | APIErrorResponse;

// * ===== Route ===== * //
type RouteParams = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
};

type PaginatedSearchParams = z.infer<typeof PaginatedSearchParamsSchema>;

type GetAnswerParams = z.infer<typeof GetAnswersSchema>;
