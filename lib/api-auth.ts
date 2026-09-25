import type { NextApiRequest } from "next";

import { requireAuthenticatedUser } from "@/lib/auth-server";
import { requireStoreMembership } from "@/lib/store-membership";

export async function requireStoreContext(request: NextApiRequest) {
  const authUser = await requireAuthenticatedUser(request);
  return requireStoreMembership(authUser.id);
}

export function queryString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
