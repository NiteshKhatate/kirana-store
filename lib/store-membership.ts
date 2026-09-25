import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api-errors";

export async function requireStoreMembership(
  supabaseUserId: string,
  requestedStoreId?: string,
) {
  const user = await prisma.user.findUnique({
    where: { supabaseUserId },
  });

  if (!user) {
    throw new ApiError("FORBIDDEN", "User is not mapped to a store", 403);
  }

  const membership = await prisma.storeMember.findFirst({
    where: {
      userId: user.id,
      isActive: true,
      ...(requestedStoreId ? { storeId: requestedStoreId } : {}),
    },
    include: { store: true },
  });

  if (!membership) {
    throw new ApiError("FORBIDDEN", "User has no active store membership", 403);
  }

  return { user, membership, store: membership.store };
}
