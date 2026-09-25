import type { NextApiRequest, NextApiResponse } from "next";

import { ApiError, sendApiError } from "@/lib/api-errors";
import type { ApiFailure } from "@/types/api";

export function requireMethod(
  request: NextApiRequest,
  response: NextApiResponse<ApiFailure>,
  method: string,
): boolean {
  if (request.method === method) {
    return true;
  }

  response.setHeader("Allow", method);
  sendApiError(
    response,
    new ApiError("METHOD_NOT_ALLOWED", `Method ${request.method ?? "unknown"} is not allowed`, 405),
  );
  return false;
}
