import type { ZodIssue } from "zod";

export type ApiSuccess<T> = {
  data: T;
  error: null;
};

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "DUPLICATE_SKU"
  | "INSUFFICIENT_STOCK"
  | "CREDIT_LIMIT_EXCEEDED"
  | "INVALID_PAYMENT"
  | "CONFLICT"
  | "METHOD_NOT_ALLOWED"
  | "INTERNAL_ERROR";

export type ApiErrorBody = {
  code: ApiErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type ApiFailure = {
  data: null;
  error: ApiErrorBody;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type ValidationIssue = Pick<ZodIssue, "path" | "message">;
