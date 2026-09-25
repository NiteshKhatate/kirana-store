import { z, type ZodType } from "zod";

import { validationError } from "@/lib/api-errors";

export function parseWithSchema<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw validationError(result.error);
  }

  return result.data;
}

export function parseJsonBody<T>(schema: ZodType<T>, body: unknown): T {
  return parseWithSchema(schema, body);
}

export const nonEmptyString = z.string().trim().min(1);
