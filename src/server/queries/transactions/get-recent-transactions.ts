import { prisma } from "@/server/db/prisma";

export async function getRecentTransactions(userId: string) {
  const label = `[perf] getRecentTransactions ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  console.time(label);
  const transactions = await prisma.transaction.findMany({
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
  console.timeEnd(label);

  return transactions;
}

export type GetRecentTransactionsResult = Awaited<ReturnType<typeof getRecentTransactions>>;
