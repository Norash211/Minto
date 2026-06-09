import { prisma } from "@/server/db/prisma";

export async function getDebts(userId: string) {
  return prisma.debt.findMany({
    where: {
      userId,
    },
    include: {
      linkedFinancialAccount: true,
      scheduledPayments: {
        where: {
          status: "PENDING",
        },
        orderBy: [{ dueDate: "asc" }, { name: "asc" }],
      },
    },
    orderBy: [{ status: "asc" }, { dueDay: "asc" }, { name: "asc" }],
  });
}

export type GetDebtsResult = Awaited<ReturnType<typeof getDebts>>;
