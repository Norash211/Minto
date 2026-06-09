import { prisma } from "@/server/db/prisma";

export async function getAccounts(userId: string) {
  return prisma.financialAccount.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
}

export type GetAccountsResult = Awaited<ReturnType<typeof getAccounts>>;
