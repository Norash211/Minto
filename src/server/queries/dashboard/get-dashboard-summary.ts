import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";

export type DashboardSummary = {
  totalBalance: Prisma.Decimal;
  totalDebt: Prisma.Decimal;
  monthlySubscriptions: Prisma.Decimal;
  activeGoals: number;
};

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const [accounts, debts, subscriptions, activeGoals] = await Promise.all([
    prisma.financialAccount.aggregate({
      where: {
        userId,
        isActive: true,
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

  return {
    totalBalance: accounts._sum.currentBalance ?? new Prisma.Decimal(0),
    totalDebt: debts._sum.currentBalance ?? new Prisma.Decimal(0),
    monthlySubscriptions: subscriptions._sum.amount ?? new Prisma.Decimal(0),
    activeGoals,
  };
}
