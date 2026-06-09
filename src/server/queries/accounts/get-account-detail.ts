import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";

function decimalToNumber(value: { toNumber(): number } | null | undefined) {
  return value ? value.toNumber() : 0;
}

export async function getAccountDetail(userId: string, accountId: string) {
  const label = `[perf] getAccountDetail ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  console.time(label);
  const accountLabel = `${label} financialAccount.findFirst`;
  console.time(accountLabel);
  const account = await prisma.financialAccount.findFirst({
    where: {
      id: accountId,
      userId,
      isActive: true,
    },
    include: {
      entries: {
        include: {
          transaction: {
            include: {
              entries: {
                include: {
                  financialAccount: true,
                },
              },
            },
          },
        },
        orderBy: {
          transaction: {
            date: "desc",
          },
        },
        take: 20,
      },
    },
  });
  console.timeEnd(accountLabel);

  if (!account) {
    console.timeEnd(label);
    return null;
  }

  const [totals, transactionCount] = await Promise.all([
    (async () => {
      const queryLabel = `${label} transactionEntry.groupBy`;
      console.time(queryLabel);
      const result = await prisma.transactionEntry.groupBy({
        by: ["direction"],
        where: {
          financialAccountId: account.id,
        },
        _sum: {
          amount: true,
        },
      });
      console.timeEnd(queryLabel);
      return result;
    })(),
    (async () => {
      const queryLabel = `${label} transactionEntry.count`;
      console.time(queryLabel);
      const result = await prisma.transactionEntry.count({
        where: {
          financialAccountId: account.id,
        },
      });
      console.timeEnd(queryLabel);
      return result;
    })(),
  ]);

  const totalIn =
    totals.find((total) => total.direction === "IN")?._sum.amount ?? new Prisma.Decimal(0);
  const totalOut =
    totals.find((total) => total.direction === "OUT")?._sum.amount ?? new Prisma.Decimal(0);
  const currentBalance = decimalToNumber(account.currentBalance);
  const creditLimit = decimalToNumber(account.creditLimit);

  const result = {
    account,
    transactions: account.entries.map((entry) => entry.transaction),
    summary: {
      totalIn,
      totalOut,
      transactionCount,
      currentBalance: account.currentBalance,
      debtAmount: account.type === "CREDIT_CARD" ? account.currentBalance : null,
      creditLimit: account.type === "CREDIT_CARD" ? account.creditLimit : null,
      availableCredit:
        account.type === "CREDIT_CARD" ? Math.max(creditLimit - currentBalance, 0) : null,
      statementDay: account.type === "CREDIT_CARD" ? account.statementDay : null,
      paymentDueDay: account.type === "CREDIT_CARD" ? account.paymentDueDay : null,
    },
  };

  console.timeEnd(label);
  return result;
}

export type GetAccountDetailResult = NonNullable<
  Awaited<ReturnType<typeof getAccountDetail>>
>;
