import { prisma } from "@/server/db/prisma";

export async function getRecentTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: {
      userId,
    },
    include: {
      entries: {
        include: {
          financialAccount: true,
        },
      },
      subscription: true,
      debt: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 10,
  });
}

export type GetRecentTransactionsResult = Awaited<ReturnType<typeof getRecentTransactions>>;
