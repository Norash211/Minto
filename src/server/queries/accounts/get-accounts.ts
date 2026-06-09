import { prisma } from "@/server/db/prisma";

export async function getAccounts(userId: string) {
  const label = `[perf] getAccounts ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  console.time(label);
  const accounts = await prisma.financialAccount.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
  console.timeEnd(label);

  return accounts;
}

export type GetAccountsResult = Awaited<ReturnType<typeof getAccounts>>;
