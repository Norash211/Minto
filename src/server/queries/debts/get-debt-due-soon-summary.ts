import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";

function getDebtDueSoonWindow() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysFromToday = new Date(today);
  sevenDaysFromToday.setDate(sevenDaysFromToday.getDate() + 7);
  sevenDaysFromToday.setHours(23, 59, 59, 999);

  return { today, sevenDaysFromToday };
}

export type DebtDueSoonSummary = {
  totalDueSoon: Prisma.Decimal;
  count: number;
};

export async function getDebtDueSoonSummary(userId: string): Promise<DebtDueSoonSummary> {
  const { today, sevenDaysFromToday } = getDebtDueSoonWindow();
  const where = {
    userId,
    status: "PENDING" as const,
    linkedDebtId: {
      not: null,
    },
    dueDate: {
      gte: today,
      lte: sevenDaysFromToday,
    },
  };

  const [total, count] = await Promise.all([
    prisma.scheduledPayment.aggregate({
      where,
      _sum: {
        amount: true,
      },
    }),
    prisma.scheduledPayment.count({
      where,
    }),
  ]);

  return {
    totalDueSoon: total._sum.amount ?? new Prisma.Decimal(0),
    count,
  };
}
