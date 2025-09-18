import { NextResponse } from "next/server";
import z, { ZodError } from "zod";

import { RequestError, ValidationError } from "../http-errors";
import logger from "../logger";

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

    logger.error(
      { err: error },
      `${responseType.toUpperCase()} Error: ${error.message}`
    );

    return formatResponse(responseType, statusCode, message, errors);
  }

  if (error instanceof ZodError) {
    // TODO: check if z.flattenError(err) method works as err.flatten()
    const flattenError = z.flattenError(error);
    const validationError = new ValidationError(
      flattenError.fieldErrors as Record<string, string[]>
    );
    // const validationError = new ValidationError(
    //   error.flatten().fieldErrors as Record<string, string[]>
    // );

    logger.error(
      { err: error },
      `Validation Error: ${validationError.message}`
    );

    const { statusCode, message, errors } = validationError;
    return formatResponse(responseType, statusCode, message, errors);
  }

  if (error instanceof Error) {
    logger.error(error.message);

    return formatResponse(responseType, 500, error.message);
  }

  logger.error({ err: error }, "An unexpected error occurred");
  return formatResponse(responseType, 500, "An unexpected error occurred");
};

export default handleError;
