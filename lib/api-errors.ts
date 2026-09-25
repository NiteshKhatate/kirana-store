import type { NextApiResponse } from "next";
import { z } from "zod";

import type { ApiErrorBody, ApiErrorCode, ApiFailure } from "@/types/api";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly statusCode: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}

export function validationError(error: z.ZodError): ApiError {
  const fieldErrors = Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).filter(
      ([, messages]) => messages && messages.length > 0,
    ),
  ) as Record<string, string[]>;

  return new ApiError(
    "VALIDATION_ERROR",
    "Invalid request",
    400,
    fieldErrors,
  );
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof z.ZodError) {
    return validationError(error);
  }

  return new ApiError("INTERNAL_ERROR", "An unexpected error occurred", 500);
}

export function sendApiError(
  response: NextApiResponse<ApiFailure>,
  error: unknown,
): void {
  const apiError = toApiError(error);
  const body: ApiErrorBody = {
    code: apiError.code,
    message: apiError.message,
    ...(apiError.fieldErrors ? { fieldErrors: apiError.fieldErrors } : {}),
  };

  response.status(apiError.statusCode).json({ data: null, error: body });
}
