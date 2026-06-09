import { prisma } from "@/server/db/prisma";

function decimalToNumber(value: { toNumber(): number } | null | undefined) {
  return value ? value.toNumber() : 0;
}

function getMonthWindow() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  return { monthStart, monthEnd };
}

function getSignedTransactionAmount(
  transaction: Awaited<ReturnType<typeof getMonthlyTransactions>>[number],
) {
  const inAmount = transaction.entries
    .filter((entry) => entry.direction === "IN")
    .reduce((total, entry) => total + decimalToNumber(entry.amount), 0);
  const outAmount = transaction.entries
    .filter((entry) => entry.direction === "OUT")
    .reduce((total, entry) => total + decimalToNumber(entry.amount), 0);

  return inAmount - outAmount;
}

function getMonthlyTransactions(userId: string, monthStart: Date, monthEnd: Date) {
  return prisma.transaction.findMany({
    where: {
      userId,
      status: "COMPLETED",
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    include: {
      entries: true,
    },
  });
}

function getMonthLabel(date: Date) {
  const label = new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
  }).format(date);

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export async function getForecast(userId: string) {
  const { monthStart, monthEnd } = getMonthWindow();

  const [accounts, transactions, subscriptions, scheduledPayments, debts] =
    await Promise.all([
      prisma.financialAccount.findMany({
        where: {
          userId,
          isActive: true,
        },
      }),
      getMonthlyTransactions(userId, monthStart, monthEnd),
      prisma.subscription.findMany({
        where: {
          userId,
          isActive: true,
          frequency: "MONTHLY",
        },
      }),
      prisma.scheduledPayment.findMany({
        where: {
          userId,
          status: "PENDING",
          dueDate: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      }),
      prisma.debt.findMany({
        where: {
          userId,
          status: "ACTIVE",
        },
      }),
    ]);

  const currentBalance = accounts.reduce(
    (total, account) => total + decimalToNumber(account.currentBalance),
    0,
  );
  const expectedIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + Math.max(getSignedTransactionAmount(transaction), 0), 0);
  const monthlySubscriptions = subscriptions.reduce(
    (total, subscription) => total + decimalToNumber(subscription.amount),
    0,
  );
  const scheduledStandalonePayments = scheduledPayments
    .filter((payment) => !payment.linkedSubscriptionId && !payment.linkedDebtId)
    .reduce((total, payment) => total + decimalToNumber(payment.amount), 0);
  const scheduledDebtIds = new Set(
    scheduledPayments
      .map((payment) => payment.linkedDebtId)
      .filter((debtId): debtId is string => Boolean(debtId)),
  );
  const activeDebtPayments = debts
    .filter((debt) => !scheduledDebtIds.has(debt.id))
    .reduce((total, debt) => total + decimalToNumber(debt.monthlyPayment), 0);
  const expectedExpenses =
    monthlySubscriptions + scheduledStandalonePayments + activeDebtPayments;
  const netChange = expectedIncome - expectedExpenses;

  return {
    monthLabel: getMonthLabel(monthStart),
    currentBalance,
    expectedIncome,
    expectedExpenses,
    projectedBalance: currentBalance + netChange,
    netChange,
    hasData:
      accounts.length > 0 ||
      transactions.length > 0 ||
      subscriptions.length > 0 ||
      scheduledPayments.length > 0 ||
      debts.length > 0,
  };
}

export type GetForecastResult = Awaited<ReturnType<typeof getForecast>>;
