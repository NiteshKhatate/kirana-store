import type { NextApiRequest, NextApiResponse } from "next";

import { requireAuthenticatedUser } from "@/lib/auth-server";
import { sendApiError } from "@/lib/api-errors";
import { requireMethod } from "@/lib/api-method";
import { requireStoreMembership } from "@/lib/store-membership";
import type { ApiResponse } from "@/types/api";

type MeResponse = {
  user: { id: string; email: string | null; displayName: string | null };
  store: { id: string; name: string };
  membership: { id: string; role: string };
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<MeResponse>>,
) {
  if (!requireMethod(request, response, "GET")) return;

  try {
    const authUser = await requireAuthenticatedUser(request);
    const requestedStoreId =
      typeof request.query.storeId === "string" ? request.query.storeId : undefined;
    const result = await requireStoreMembership(authUser.id, requestedStoreId);

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
