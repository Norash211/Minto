import type { DashboardSummary, GetAccountsResult, GetRecentTransactionsResult } from "@/server/queries";
import type { MonthlyForecast, Transaction } from "@/types/finance";

function decimalToNumber(value: { toNumber(): number }) {
  return value.toNumber();
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
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
