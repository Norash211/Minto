import { prisma } from "@/server/db/prisma";

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  return date;
}

export async function getUpcomingPayments(userId: string) {
  return prisma.scheduledPayment.findMany({
    where: {
      userId,
      status: "PENDING",
      dueDate: {
        gte: startOfToday(),
      },
    },
    include: {
      paymentFinancialAccount: true,
      linkedDebt: true,
      linkedSubscription: true,
      linkedLoanGiven: true,
    },
    orderBy: {
      dueDate: "asc",
    },
    take: 5,
  });
}

export type GetUpcomingPaymentsResult = Awaited<ReturnType<typeof getUpcomingPayments>>;
