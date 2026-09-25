import { prisma } from "@/lib/prisma";

type BootstrapInput = {
  supabaseUserId: string;
  email?: string;
  displayName?: string;
  storeName?: string;
};

export async function bootstrapApplicationUser(input: BootstrapInput) {
  return prisma.$transaction(async (transaction) => {
    const user = await transaction.user.upsert({
      where: { supabaseUserId: input.supabaseUserId },
      create: {
        supabaseUserId: input.supabaseUserId,
        email: input.email,
        displayName: input.displayName,
      },
      update: {
        ...(input.email ? { email: input.email } : {}),
        ...(input.displayName ? { displayName: input.displayName } : {}),
      },
    });

    let membership = await transaction.storeMember.findFirst({
      where: { userId: user.id, isActive: true },
      include: { store: true },
    });

    if (!membership) {
      const store = await transaction.store.create({
        data: {
          name:
            input.storeName ??
            (input.displayName ? `${input.displayName}'s Store` : "My Kirana Store"),
        },
      });

      membership = await transaction.storeMember.create({
        data: {
          storeId: store.id,
          userId: user.id,
          role: "OWNER",
          isActive: true,
        },
        include: { store: true },
      });
    }

    return { user, membership, store: membership.store };
  });
}

export type BootstrappedApplication = Awaited<
  ReturnType<typeof bootstrapApplicationUser>
>;
