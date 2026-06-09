import type { GetAccountDetailResult } from "@/server/queries";

function decimalToNumber(value: { toNumber(): number } | null | undefined) {
  return value ? value.toNumber() : 0;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getSignedTransactionAmount(
  transaction: GetAccountDetailResult["transactions"][number],
) {
  const inAmount = transaction.entries
    .filter((entry) => entry.direction === "IN")
    .reduce((total, entry) => total + decimalToNumber(entry.amount), 0);
  const outAmount = transaction.entries
    .filter((entry) => entry.direction === "OUT")
    .reduce((total, entry) => total + decimalToNumber(entry.amount), 0);

  return inAmount - outAmount;
}

function getTransactionCategory(transaction: GetAccountDetailResult["transactions"][number]) {
  if (transaction.type === "OPENING_BALANCE") {
    return "Saldo inicial";
  }

  return transaction.category ?? transaction.type;
}

const accountTypeLabels = {
  CHECKING: "Nómina / débito",
  SAVINGS: "Ahorro",
  CASH: "Efectivo",
  DIGITAL_WALLET: "Wallet digital",
  CREDIT_CARD: "Tarjeta de crédito",
  INVESTMENT: "Inversión",
} satisfies Record<GetAccountDetailResult["account"]["type"], string>;

export function toAccountDetailViewModel(detail: GetAccountDetailResult) {
  const isCreditCard = detail.account.type === "CREDIT_CARD";

  return {
    account: {
      id: detail.account.id,
      name: detail.account.name,
      type: detail.account.type,
      typeLabel: accountTypeLabels[detail.account.type],
      currency: detail.account.currency,
      notes: detail.account.notes,
      isCreditCard,
    },
    summary: {
      totalIn: decimalToNumber(detail.summary.totalIn),
      totalOut: decimalToNumber(detail.summary.totalOut),
      transactionCount: detail.summary.transactionCount,
      currentBalance: decimalToNumber(detail.summary.currentBalance),
      debtAmount: decimalToNumber(detail.summary.debtAmount),
      creditLimit: decimalToNumber(detail.summary.creditLimit),
      availableCredit: detail.summary.availableCredit ?? 0,
      statementDay: detail.summary.statementDay,
      paymentDueDay: detail.summary.paymentDueDay,
    },
    transactions: detail.transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      category: getTransactionCategory(transaction),
      amount: getSignedTransactionAmount(transaction),
      date: formatDate(transaction.date),
      accounts: transaction.entries
        .map((entry) => entry.financialAccount.name)
        .filter((name, index, names) => names.indexOf(name) === index)
        .join(" / "),
    })),
  };
}
