import type { Session } from "@supabase/supabase-js";

import type { ApiResponse } from "@/types/api";

export class ApiClientError extends Error {
  code: string;
  fieldErrors?: Record<string, string[]>;

  constructor(code: string, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export async function apiRequest<T>(session: Session | null, input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
  if (!session) throw new ApiClientError("UNAUTHORIZED", "Authentication is required");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.access_token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(input, { ...init, headers });
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || result.error) {
    throw new ApiClientError(result.error?.code ?? "INTERNAL_ERROR", result.error?.message ?? "Request failed", result.error?.fieldErrors);
  }
  return result.data;
}
