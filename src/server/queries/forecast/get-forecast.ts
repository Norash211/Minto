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
  const label = `[perf] getForecast ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  console.time(label);
  const { monthStart, monthEnd } = getMonthWindow();

  const [accounts, transactions, subscriptions, scheduledPayments, debts] =
    await Promise.all([
      (async () => {
        const queryLabel = `${label} financialAccount.findMany`;
        console.time(queryLabel);
        const result = await prisma.financialAccount.findMany({
          where: {
            userId,
            isActive: true,
          },
        });
        console.timeEnd(queryLabel);
        return result;
      })(),
      (async () => {
        const queryLabel = `${label} monthlyTransactions.findMany`;
        console.time(queryLabel);
        const result = await getMonthlyTransactions(userId, monthStart, monthEnd);
        console.timeEnd(queryLabel);
        return result;
      })(),
      (async () => {
        const queryLabel = `${label} subscription.findMany`;
        console.time(queryLabel);
        const result = await prisma.subscription.findMany({
          where: {
            userId,
            isActive: true,
            frequency: "MONTHLY",
          },
        });
        console.timeEnd(queryLabel);
        return result;
      })(),
      (async () => {
        const queryLabel = `${label} scheduledPayment.findMany`;
        console.time(queryLabel);
        const result = await prisma.scheduledPayment.findMany({
          where: {
            userId,
            status: "PENDING",
            dueDate: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        });
        console.timeEnd(queryLabel);
        return result;
      })(),
      (async () => {
        const queryLabel = `${label} debt.findMany`;
        console.time(queryLabel);
        const result = await prisma.debt.findMany({
          where: {
            userId,
            status: "ACTIVE",
          },
        });
        console.timeEnd(queryLabel);
        return result;
      })(),
    ]);

  const currentBalance = accounts.reduce(
    (total, account) => {
      const balance = decimalToNumber(account.currentBalance);

      return account.type === "CREDIT_CARD" ? total - balance : total + balance;
    },
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

  const result = {
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

  console.timeEnd(label);
  return result;
}

export type GetForecastResult = Awaited<ReturnType<typeof getForecast>>;
