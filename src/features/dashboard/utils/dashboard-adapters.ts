import type {
  DashboardSummary,
  GetAccountsResult,
  GetDashboardBucketsResult,
  GetRecentTransactionsResult,
  GetUpcomingPaymentsResult,
} from "@/server/queries";
import type { Bucket, MonthlyForecast, Transaction, UpcomingPayment } from "@/types/finance";

function decimalToNumber(value: { toNumber(): number }) {
  return value.toNumber();
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getBucketDescription(bucket: GetDashboardBucketsResult[number]) {
  if (bucket.type === "EMERGENCY") {
    return "Fondo protegido para imprevistos";
  }

  if (bucket.type === "COMMITTED") {
    return "Dinero asignado para compromisos";
  }

  if (bucket.type === "GOAL") {
    return "Ahorro reservado para una meta";
  }

  return "Dinero organizado por prioridad";
}

function getSignedTransactionAmount(transaction: GetRecentTransactionsResult[number]) {
  const inAmount = transaction.entries
    .filter((entry) => entry.direction === "IN")
    .reduce((total, entry) => total + decimalToNumber(entry.amount), 0);
  const outAmount = transaction.entries
    .filter((entry) => entry.direction === "OUT")
    .reduce((total, entry) => total + decimalToNumber(entry.amount), 0);

  return inAmount - outAmount;
}

export function toDashboardMoneySummary(
  summary: DashboardSummary,
  accounts: GetAccountsResult,
) {
  const totalMoney =
    accounts.length > 0
      ? accounts.reduce((total, account) => total + decimalToNumber(account.currentBalance), 0)
      : decimalToNumber(summary.totalBalance);
  const committedMoney =
    decimalToNumber(summary.totalDebt) + decimalToNumber(summary.monthlySubscriptions);

  return {
    totalMoney,
    committedMoney,
    freeMoney: totalMoney - committedMoney,
  };
}

export function toDashboardDebtSummary(summary: DashboardSummary) {
  return {
    totalDebtOwed: decimalToNumber(summary.totalDebt),
    debtDueSoonMoney: 0,
  };
}

export function toDashboardMonthlyForecast(
  summary: DashboardSummary,
  transactions: GetRecentTransactionsResult,
): MonthlyForecast {
  const expectedIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + getSignedTransactionAmount(transaction), 0);
  const expectedCommitted =
    decimalToNumber(summary.totalDebt) + decimalToNumber(summary.monthlySubscriptions);

  return {
    month: "Junio 2026",
    expectedIncome,
    expectedCommitted,
    expectedFreeMoney: expectedIncome - expectedCommitted,
  };
}

export function toDashboardRecentTransactions(
  transactions: GetRecentTransactionsResult,
): Transaction[] {
  return transactions.map((transaction) => ({
    id: transaction.id,
    merchant: transaction.description,
    category: transaction.category ?? transaction.type,
    amount: getSignedTransactionAmount(transaction),
    date: formatDate(transaction.date),
    account: transaction.entries
      .map((entry) => entry.financialAccount.name)
      .filter((name, index, names) => names.indexOf(name) === index)
      .join(" / "),
  }));
}

export function toDashboardBuckets(buckets: GetDashboardBucketsResult): Bucket[] {
  return buckets.map((bucket) => ({
    id: bucket.id,
    name: bucket.name,
    description: getBucketDescription(bucket),
    balance: decimalToNumber(bucket.currentAmount),
    target: bucket.targetAmount ? decimalToNumber(bucket.targetAmount) : undefined,
    committed: bucket.type !== "FREE",
  }));
}

export function toDashboardUpcomingPayments(
  payments: GetUpcomingPaymentsResult,
): UpcomingPayment[] {
  return payments.map((payment) => ({
    id: payment.id,
    name: payment.name,
    dueDate: formatDate(payment.dueDate),
    amount: decimalToNumber(payment.amount),
    bucket:
      payment.linkedSubscription?.name ??
      payment.linkedDebt?.name ??
      payment.linkedLoanGiven?.borrowerName ??
      payment.category ??
      payment.paymentFinancialAccount?.name ??
      "Pago programado",
  }));
}
