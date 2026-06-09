import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";

export type DashboardSummary = {
  totalBalance: Prisma.Decimal;
  totalDebt: Prisma.Decimal;
  monthlySubscriptions: Prisma.Decimal;
  activeGoals: number;
};

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const [assetAccounts, creditCards, debts, subscriptions, activeGoals] = await Promise.all([
    prisma.financialAccount.aggregate({
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
    }),
    prisma.financialAccount.aggregate({
      where: {
        userId,
        isActive: true,
        type: "CREDIT_CARD",
      },
      _sum: {
        currentBalance: true,
      },
    }),
    prisma.debt.aggregate({
      where: {
        userId,
        status: "ACTIVE",
      },
      _sum: {
        currentBalance: true,
      },
    }),
    prisma.subscription.aggregate({
      where: {
        userId,
        isActive: true,
        frequency: "MONTHLY",
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.goal.count({
      where: {
        userId,
        status: "ACTIVE",
      },
    }),
  ]);

  const assetsTotal = assetAccounts._sum.currentBalance ?? new Prisma.Decimal(0);
  const creditCardDebt = creditCards._sum.currentBalance ?? new Prisma.Decimal(0);

  return {
    totalBalance: assetsTotal.minus(creditCardDebt),
    totalDebt: debts._sum.currentBalance ?? new Prisma.Decimal(0),
    monthlySubscriptions: subscriptions._sum.amount ?? new Prisma.Decimal(0),
    activeGoals,
  };
}
