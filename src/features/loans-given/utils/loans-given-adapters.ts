import type { GetLoansGivenResult } from "@/server/queries";
import type { LoanGiven } from "@/types/finance";

function decimalToNumber(value: { toNumber(): number }) {
  return value.toNumber();
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getRemainingAmount(loan: GetLoansGivenResult[number]) {
  return Math.max(
    decimalToNumber(loan.principalAmount) - decimalToNumber(loan.amountRepaid),
    0,
  );
}

function getLoanStatus(loan: GetLoansGivenResult[number]): LoanGiven["status"] {
  if (loan.status === "PAID") {
    return "completed";
  }

  if (loan.status === "OVERDUE") {
    return "late";
  }

  return "active";
}

function getPaymentFrequency(loan: GetLoansGivenResult[number]): LoanGiven["paymentFrequency"] {
  const nextPayment = loan.scheduledPayments[0];

  if (nextPayment?.frequency === "WEEKLY") {
    return "weekly";
  }

  if (nextPayment?.frequency === "BIWEEKLY") {
    return "biweekly";
  }

  if (nextPayment?.frequency === "MONTHLY") {
    return "monthly";
  }

  return "custom";
}

function getExpectedIncomeDate(loan: GetLoansGivenResult[number]) {
  const nextPayment = loan.scheduledPayments[0];

  if (nextPayment) {
    return formatDate(nextPayment.dueDate);
  }

  return loan.expectedReturnDate ? formatDate(loan.expectedReturnDate) : "";
}

export function toLoansGivenViewLoans(loans: GetLoansGivenResult): LoanGiven[] {
  return loans.map((loan) => {
    const totalAmount = decimalToNumber(loan.principalAmount);
    const amountPaid = decimalToNumber(loan.amountRepaid);
    const expectedReturnDate = loan.expectedReturnDate
      ? formatDate(loan.expectedReturnDate)
      : "";

    return {
      id: loan.id,
      personName: loan.borrowerName,
      totalAmount,
      amountPaid,
      remainingAmount: getRemainingAmount(loan),
      loanDate: formatDate(loan.createdAt),
      expectedIncomeDate: getExpectedIncomeDate(loan),
      estimatedFullRepaymentDate: expectedReturnDate,
      paymentFrequency: getPaymentFrequency(loan),
      status: getLoanStatus(loan),
      notes: loan.notes ?? "",
    };
  });
}
