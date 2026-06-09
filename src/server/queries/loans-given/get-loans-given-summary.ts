import { LoanGivenStatus, Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";

const relevantLoanStatuses: LoanGivenStatus[] = ["ACTIVE", "PARTIALLY_REPAID", "OVERDUE"];

export type LoansGivenSummary = {
  totalPrincipal: Prisma.Decimal;
  totalRepaid: Prisma.Decimal;
  activeLoansCount: number;
  overdueLoansCount: number;
};

export async function getLoansGivenSummary(userId: string): Promise<LoansGivenSummary> {
  const [totals, activeLoansCount, overdueLoansCount] = await Promise.all([
    prisma.loanGiven.aggregate({
      where: {
        userId,
        status: {
          in: relevantLoanStatuses,
        },
      },
      _sum: {
        principalAmount: true,
        amountRepaid: true,
      },
    }),
    prisma.loanGiven.count({
      where: {
        userId,
        status: {
          in: relevantLoanStatuses,
        },
      },
    }),
    prisma.loanGiven.count({
      where: {
        userId,
        status: "OVERDUE",
      },
    }),
  ]);

  return {
    totalPrincipal: totals._sum.principalAmount ?? new Prisma.Decimal(0),
    totalRepaid: totals._sum.amountRepaid ?? new Prisma.Decimal(0),
    activeLoansCount,
    overdueLoansCount,
  };
}
