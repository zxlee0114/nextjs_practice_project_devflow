import { NextResponse } from "next/server";
import z from "zod";

import {
  GetAnswersSchema,
  PaginatedSearchParamsSchema,
} from "@/lib/validations";

// * ===== Data =====
type Tag = {
  _id: string;
  name: string;
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
  answers: number;
  views: number;
};

type Answer = {
  _id: string;
  author: Author;
  content: string;
  createdAt: Date;
};

// * ===== Response ======
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

type APIResponse<T = null> = NextResponse<SuccessResponse<T>> | ErrorResponse;

type APIErrorResponse = NextResponse<ErrorResponse>;

// * ===== Route =====
type RouteParams = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
};

type PaginatedSearchParams = z.infer<typeof PaginatedSearchParamsSchema>;

type GetAnswerParams = z.infer<typeof GetAnswersSchema>;
