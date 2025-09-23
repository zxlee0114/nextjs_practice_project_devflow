import { NextResponse } from "next/server";
import z from "zod";

import { PaginatedSearchParamsSchema } from "@/lib/validations";

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

type ActionResponse<T = null> = SuccessResponse<T> | ErrorResponse;

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

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T>> | ErrorResponse;

type RouteParams = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
};

type PaginatedSearchParams = z.infer<typeof PaginatedSearchParamsSchema>;
