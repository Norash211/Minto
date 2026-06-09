import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";

export type DashboardSummary = {
  totalBalance: Prisma.Decimal;
  totalDebt: Prisma.Decimal;
  monthlySubscriptions: Prisma.Decimal;
  activeGoals: number;
};

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const label = `[perf] getDashboardSummary ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  console.time(label);
  const [assetAccounts, creditCards, debts, subscriptions, activeGoals] = await Promise.all([
    (async () => {
      const queryLabel = `${label} assetAccounts.aggregate`;
      console.time(queryLabel);
      const result = await prisma.financialAccount.aggregate({
        where: {
          userId,
          isActive: true,
          type: {
            not: "CREDIT_CARD",
          },
        },
        _sum: {
          currentBalance: true,
        },
      });
      console.timeEnd(queryLabel);
      return result;
    })(),
    (async () => {
      const queryLabel = `${label} creditCards.aggregate`;
      console.time(queryLabel);
      const result = await prisma.financialAccount.aggregate({
        where: {
          userId,
          isActive: true,
          type: "CREDIT_CARD",
        },
        _sum: {
          currentBalance: true,
        },
      });
      console.timeEnd(queryLabel);
      return result;
    })(),
    (async () => {
      const queryLabel = `${label} debts.aggregate`;
      console.time(queryLabel);
      const result = await prisma.debt.aggregate({
        where: {
          userId,
          status: "ACTIVE",
        },
        _sum: {
          currentBalance: true,
        },
      });
      console.timeEnd(queryLabel);
      return result;
    })(),
    (async () => {
      const queryLabel = `${label} subscriptions.aggregate`;
      console.time(queryLabel);
      const result = await prisma.subscription.aggregate({
        where: {
          userId,
          isActive: true,
          frequency: "MONTHLY",
        },
        _sum: {
          amount: true,
        },
      });
      console.timeEnd(queryLabel);
      return result;
    })(),
    (async () => {
      const queryLabel = `${label} activeGoals.count`;
      console.time(queryLabel);
      const result = await prisma.goal.count({
        where: {
          userId,
          status: "ACTIVE",
        },
      });
      console.timeEnd(queryLabel);
      return result;
    })(),
  ]);

  const assetsTotal = assetAccounts._sum.currentBalance ?? new Prisma.Decimal(0);
  const creditCardDebt = creditCards._sum.currentBalance ?? new Prisma.Decimal(0);

  const result = {
    totalBalance: assetsTotal.minus(creditCardDebt),
    totalDebt: debts._sum.currentBalance ?? new Prisma.Decimal(0),
    monthlySubscriptions: subscriptions._sum.amount ?? new Prisma.Decimal(0),
    activeGoals,
  };

  console.timeEnd(label);
  return result;
}
