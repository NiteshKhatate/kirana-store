import { z } from "zod";

import { validationError } from "@/lib/api-errors";

export function parseWithSchema<TSchema extends z.ZodTypeAny>(schema: TSchema, input: unknown): z.output<TSchema> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw validationError(result.error);
  }

  return result.data;
}

export function parseJsonBody<TSchema extends z.ZodTypeAny>(schema: TSchema, body: unknown): z.output<TSchema> {
  return parseWithSchema(schema, body);
}

export const nonEmptyString = z.string().trim().min(1);
