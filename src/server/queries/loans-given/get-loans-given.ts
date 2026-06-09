import { prisma } from "@/server/db/prisma";

export async function getLoansGiven(userId: string) {
  return prisma.loanGiven.findMany({
    where: {
      userId,
    },
    include: {
      scheduledPayments: {
        where: {
          status: "PENDING",
        },
        orderBy: [{ dueDate: "asc" }, { name: "asc" }],
      },
    },
    orderBy: [{ status: "asc" }, { expectedReturnDate: "asc" }, { borrowerName: "asc" }],
  });
}

export type GetLoansGivenResult = Awaited<ReturnType<typeof getLoansGiven>>;
