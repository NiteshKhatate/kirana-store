import type { NextApiRequest, NextApiResponse } from "next";

import { requireAuthenticatedUser } from "@/lib/auth-server";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { parseJsonBody } from "@/lib/validation";
import { bootstrapStoreSchema } from "@/schemas/auth";
import { bootstrapApplicationUser } from "@/services/auth-bootstrap.service";
import type { ApiResponse } from "@/types/api";

type BootstrapResponse = {
  user: { id: string; email: string | null; displayName: string | null };
  store: { id: string; name: string };
  membership: { id: string; role: string };
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<BootstrapResponse>>,
) {
  if (!requireMethod(request, response, "POST")) return;

  try {
    const authUser = await requireAuthenticatedUser(request);
    const input = parseJsonBody(bootstrapStoreSchema, request.body ?? {});
    const displayName =
      (typeof authUser.user_metadata?.full_name === "string"
        ? authUser.user_metadata.full_name
        : typeof authUser.user_metadata?.name === "string"
          ? authUser.user_metadata.name
          : undefined) ?? undefined;
    const result = await bootstrapApplicationUser({
      supabaseUserId: authUser.id,
      email: authUser.email,
      displayName,
      storeName: input.storeName,
    });

    response.status(200).json({
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          displayName: result.user.displayName,
        },
        store: { id: result.store.id, name: result.store.name },
        membership: { id: result.membership.id, role: result.membership.role },
      },
      error: null,
    });
  } catch (error) {
    sendApiError(response, error);
  }
}
