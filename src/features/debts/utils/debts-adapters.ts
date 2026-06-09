import type { GetDebtsResult } from "@/server/queries";
import type { Debt } from "@/types/finance";

function decimalToNumber(value: { toNumber(): number }) {
  return value.toNumber();
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDebtDueSoonWindow() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysFromToday = new Date(today);
  sevenDaysFromToday.setDate(sevenDaysFromToday.getDate() + 7);
  sevenDaysFromToday.setHours(23, 59, 59, 999);

  return { today, sevenDaysFromToday };
}

function getDebtKind(debt: GetDebtsResult[number]): Debt["kind"] {
  if (debt.type === "STORE_CREDIT") {
    return "credit_card";
  }

  if (debt.installmentsTotal || debt.type === "INSTALLMENT_PURCHASE" || debt.type === "BNPL") {
    return "installment";
  }

  return "personal_loan";
}

function getDebtStatus(debt: GetDebtsResult[number]): Debt["status"] {
  if (debt.status === "ACTIVE") {
    return "active";
  }

  if (debt.status === "PAID_OFF") {
    return "paid";
  }

  return "paused";
}

function getNextPayment(debt: GetDebtsResult[number]) {
  return debt.scheduledPayments[0];
}

function getDueDateLabel(debt: GetDebtsResult[number]) {
  const nextPayment = getNextPayment(debt);

  if (nextPayment) {
    return formatDate(nextPayment.dueDate);
  }

  if (debt.dueDate) {
    return formatDate(debt.dueDate);
  }

  if (debt.dueDay) {
    return `Día ${debt.dueDay}`;
  }

  return "Sin fecha";
}

function getDueSoonAmount(debt: GetDebtsResult[number]) {
  const nextPayment = getNextPayment(debt);

  if (nextPayment) {
    return decimalToNumber(nextPayment.amount);
  }

  if (debt.monthlyPayment) {
    return decimalToNumber(debt.monthlyPayment);
  }

  return 0;
}

export function toDebtsViewDebts(debts: GetDebtsResult): Debt[] {
  return debts.map((debt) => ({
    id: debt.id,
    name: debt.name,
    lender: debt.linkedFinancialAccount?.name ?? "Sin cuenta vinculada",
    kind: getDebtKind(debt),
    totalOwed: decimalToNumber(debt.currentBalance),
    dueSoonAmount: getDueSoonAmount(debt),
    dueDate: getDueDateLabel(debt),
    status: getDebtStatus(debt),
  }));
}

export function toDebtsViewSummary(debts: GetDebtsResult) {
  const { today, sevenDaysFromToday } = getDebtDueSoonWindow();

  return {
    totalDebtOwed: debts
      .filter((debt) => debt.status === "ACTIVE" || debt.status === "PAUSED")
      .reduce((total, debt) => total + decimalToNumber(debt.currentBalance), 0),
    debtDueSoonMoney: debts.reduce(
      (total, debt) =>
        total +
        debt.scheduledPayments
          .filter((payment) => payment.dueDate >= today && payment.dueDate <= sevenDaysFromToday)
          .reduce((paymentsTotal, payment) => paymentsTotal + decimalToNumber(payment.amount), 0),
      0,
    ),
  };
}
