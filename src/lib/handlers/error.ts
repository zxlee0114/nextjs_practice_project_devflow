import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { RequestError, ValidationError } from "../http-errors";

export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    const { statusCode, message, errors } = error;
    return formatResponse(responseType, statusCode, message, errors);
  }

  if (error instanceof ZodError) {
    // TODO: check alternative flatten method
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    );

    const { statusCode, message, errors } = validationError;
    return formatResponse(responseType, statusCode, message, errors);
  }

  if (error instanceof Error) {
    return formatResponse(responseType, 500, error.message);
  }

  return formatResponse(responseType, 500, "An unexpected error occurred");
};

export default handleError;
