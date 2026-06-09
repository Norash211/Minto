import type { GetRecentTransactionsResult } from "@/server/queries";
import type { Transaction } from "@/types/finance";

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

function getRelatedAccounts(transaction: GetRecentTransactionsResult[number]) {
  const accounts = transaction.entries
    .map((entry) => entry.financialAccount.name)
    .filter((name, index, names) => names.indexOf(name) === index);

  return accounts.length > 0 ? accounts.join(" / ") : "Sin cuenta";
}

export function toTransactionsViewTransactions(
  transactions: GetRecentTransactionsResult,
): Transaction[] {
  return transactions.map((transaction) => ({
    id: transaction.id,
    merchant: transaction.description,
    category: transaction.category ?? transaction.type,
    amount: getSignedTransactionAmount(transaction),
    date: formatDate(transaction.date),
    account: getRelatedAccounts(transaction),
  }));
}
