import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";

function decimalToNumber(value: { toNumber(): number } | null | undefined) {
  return value ? value.toNumber() : 0;
}

export async function getAccountDetail(userId: string, accountId: string) {
  const account = await prisma.financialAccount.findFirst({
    where: {
      id: accountId,
      userId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      type: true,
      currency: true,
      notes: true,
      currentBalance: true,
      creditLimit: true,
      statementDay: true,
      paymentDueDay: true,
      entries: {
        select: {
          transaction: {
            select: {
              id: true,
              type: true,
              category: true,
              date: true,
              description: true,
              entries: {
                select: {
                  direction: true,
                  amount: true,
                  financialAccount: {
                    select: {
                      name: true,
                    },
                  },
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

  if (!account) {
    return null;
  }

  const [totals, transactionCount] = await Promise.all([
    prisma.transactionEntry.groupBy({
      by: ["direction"],
      where: {
        financialAccountId: account.id,
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.transactionEntry.count({
      where: {
        financialAccountId: account.id,
      },
    }),
  ]);

  const totalIn =
    totals.find((total) => total.direction === "IN")?._sum.amount ?? new Prisma.Decimal(0);
  const totalOut =
    totals.find((total) => total.direction === "OUT")?._sum.amount ?? new Prisma.Decimal(0);
  const currentBalance = decimalToNumber(account.currentBalance);
  const creditLimit = decimalToNumber(account.creditLimit);

  return {
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
}

export type GetAccountDetailResult = NonNullable<
  Awaited<ReturnType<typeof getAccountDetail>>
>;
