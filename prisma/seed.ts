import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const demoEmail = "demo@minto.app";
const seedTransactionDate = new Date("2026-06-01T12:00:00.000Z");

function daysFromToday(days: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return date;
}

async function upsertByUserAndName<T extends { id: string }>(
  find: () => Promise<T | null>,
  update: (id: string) => Promise<T>,
  create: () => Promise<T>,
) {
  const existing = await find();

  if (existing) {
    return update(existing.id);
  }

  return create();
}

async function upsertTransactionWithEntries({
  userId,
  description,
  type,
  category,
  subscriptionId,
  entries,
}: {
  userId: string;
  description: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  category?: string;
  subscriptionId?: string;
  entries: Array<{
    financialAccountId: string;
    direction: "IN" | "OUT";
    amount: Prisma.Decimal;
  }>;
}) {
  const existing = await prisma.transaction.findFirst({
    where: {
      userId,
      description,
      date: seedTransactionDate,
    },
  });

  const data = {
    userId,
    type,
    currency: "MXN",
    date: seedTransactionDate,
    description,
    category,
    subscriptionId,
    status: "COMPLETED" as const,
  };

  const transaction = existing
    ? await prisma.transaction.update({
        where: { id: existing.id },
        data,
      })
    : await prisma.transaction.create({ data });

  await prisma.transactionEntry.deleteMany({
    where: { transactionId: transaction.id },
  });

  await prisma.transactionEntry.createMany({
    data: entries.map((entry) => ({
      transactionId: transaction.id,
      financialAccountId: entry.financialAccountId,
      direction: entry.direction,
      amount: entry.amount,
    })),
  });

  return transaction;
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Emmi",
      defaultCurrency: "MXN",
      timezone: "America/Mexico_City",
      locale: "es-MX",
    },
    create: {
      name: "Emmi",
      email: demoEmail,
      defaultCurrency: "MXN",
      timezone: "America/Mexico_City",
      locale: "es-MX",
    },
  });

  const nomina = await upsertByUserAndName(
    () =>
      prisma.financialAccount.findFirst({
        where: { userId: user.id, name: { in: ["Nómina", "Nomina"] } },
      }),
    (id) =>
      prisma.financialAccount.update({
        where: { id },
        data: {
          name: "Nómina",
          type: "CHECKING",
          initialBalance: new Prisma.Decimal(25000),
          currentBalance: new Prisma.Decimal(25000),
          currency: "MXN",
          creditLimit: null,
          isActive: true,
        },
      }),
    () =>
      prisma.financialAccount.create({
        data: {
          userId: user.id,
          name: "Nómina",
          type: "CHECKING",
          initialBalance: new Prisma.Decimal(25000),
          currentBalance: new Prisma.Decimal(25000),
          currency: "MXN",
        },
      }),
  );

  const ahorros = await upsertByUserAndName(
    () =>
      prisma.financialAccount.findFirst({
        where: { userId: user.id, name: "Ahorros" },
      }),
    (id) =>
      prisma.financialAccount.update({
        where: { id },
        data: {
          type: "SAVINGS",
          initialBalance: new Prisma.Decimal(80000),
          currentBalance: new Prisma.Decimal(80000),
          currency: "MXN",
          creditLimit: null,
          isActive: true,
        },
      }),
    () =>
      prisma.financialAccount.create({
        data: {
          userId: user.id,
          name: "Ahorros",
          type: "SAVINGS",
          initialBalance: new Prisma.Decimal(80000),
          currentBalance: new Prisma.Decimal(80000),
          currency: "MXN",
        },
      }),
  );

  const tarjetaBbva = await upsertByUserAndName(
    () =>
      prisma.financialAccount.findFirst({
        where: { userId: user.id, name: "Tarjeta BBVA" },
      }),
    (id) =>
      prisma.financialAccount.update({
        where: { id },
        data: {
          type: "CREDIT_CARD",
          initialBalance: new Prisma.Decimal(0),
          currentBalance: new Prisma.Decimal(12000),
          currency: "MXN",
          creditLimit: new Prisma.Decimal(50000),
          isActive: true,
        },
      }),
    () =>
      prisma.financialAccount.create({
        data: {
          userId: user.id,
          name: "Tarjeta BBVA",
          type: "CREDIT_CARD",
          initialBalance: new Prisma.Decimal(0),
          currentBalance: new Prisma.Decimal(12000),
          currency: "MXN",
          creditLimit: new Prisma.Decimal(50000),
        },
      }),
  );

  await upsertByUserAndName(
    () => prisma.bucket.findFirst({ where: { userId: user.id, name: "Gastos Mensuales" } }),
    (id) =>
      prisma.bucket.update({
        where: { id },
        data: {
          type: "COMMITTED",
          currentAmount: new Prisma.Decimal(0),
          currency: "MXN",
          priority: 1,
          isProtected: false,
        },
      }),
    () =>
      prisma.bucket.create({
        data: {
          userId: user.id,
          name: "Gastos Mensuales",
          type: "COMMITTED",
          currentAmount: new Prisma.Decimal(0),
          currency: "MXN",
          priority: 1,
        },
      }),
  );

  await upsertByUserAndName(
    () => prisma.bucket.findFirst({ where: { userId: user.id, name: "Emergencia" } }),
    (id) =>
      prisma.bucket.update({
        where: { id },
        data: {
          type: "EMERGENCY",
          targetAmount: new Prisma.Decimal(100000),
          currentAmount: new Prisma.Decimal(80000),
          currency: "MXN",
          priority: 2,
          isProtected: true,
        },
      }),
    () =>
      prisma.bucket.create({
        data: {
          userId: user.id,
          name: "Emergencia",
          type: "EMERGENCY",
          targetAmount: new Prisma.Decimal(100000),
          currentAmount: new Prisma.Decimal(80000),
          currency: "MXN",
          priority: 2,
          isProtected: true,
        },
      }),
  );

  const spotify = await upsertByUserAndName(
    () => prisma.subscription.findFirst({ where: { userId: user.id, name: "Spotify" } }),
    (id) =>
      prisma.subscription.update({
        where: { id },
        data: {
          paymentFinancialAccountId: tarjetaBbva.id,
          amount: new Prisma.Decimal(129),
          currency: "MXN",
          billingDay: 15,
          frequency: "MONTHLY",
          category: "ENTERTAINMENT",
          isActive: true,
        },
      }),
    () =>
      prisma.subscription.create({
        data: {
          userId: user.id,
          paymentFinancialAccountId: tarjetaBbva.id,
          name: "Spotify",
          amount: new Prisma.Decimal(129),
          currency: "MXN",
          billingDay: 15,
          frequency: "MONTHLY",
          category: "ENTERTAINMENT",
        },
      }),
  );

  await upsertTransactionWithEntries({
    userId: user.id,
    description: "Ingreso Nómina",
    type: "INCOME",
    category: "Nómina",
    entries: [
      {
        financialAccountId: nomina.id,
        direction: "IN",
        amount: new Prisma.Decimal(25000),
      },
    ],
  });

  await upsertTransactionWithEntries({
    userId: user.id,
    description: "Transferencia a Ahorros",
    type: "TRANSFER",
    category: "Transferencia",
    entries: [
      {
        financialAccountId: nomina.id,
        direction: "OUT",
        amount: new Prisma.Decimal(5000),
      },
      {
        financialAccountId: ahorros.id,
        direction: "IN",
        amount: new Prisma.Decimal(5000),
      },
    ],
  });

  await upsertTransactionWithEntries({
    userId: user.id,
    description: "Spotify",
    type: "EXPENSE",
    category: "Entretenimiento",
    subscriptionId: spotify.id,
    entries: [
      {
        financialAccountId: tarjetaBbva.id,
        direction: "OUT",
        amount: new Prisma.Decimal(129),
      },
    ],
  });

  const netflix = await upsertByUserAndName(
    () => prisma.subscription.findFirst({ where: { userId: user.id, name: "Netflix" } }),
    (id) =>
      prisma.subscription.update({
        where: { id },
        data: {
          paymentFinancialAccountId: tarjetaBbva.id,
          amount: new Prisma.Decimal(299),
          currency: "MXN",
          billingDay: 22,
          frequency: "MONTHLY",
          category: "ENTERTAINMENT",
          isActive: true,
        },
      }),
    () =>
      prisma.subscription.create({
        data: {
          userId: user.id,
          paymentFinancialAccountId: tarjetaBbva.id,
          name: "Netflix",
          amount: new Prisma.Decimal(299),
          currency: "MXN",
          billingDay: 22,
          frequency: "MONTHLY",
          category: "ENTERTAINMENT",
        },
      }),
  );

  const macbookDebt = await upsertByUserAndName(
    () => prisma.debt.findFirst({ where: { userId: user.id, name: "MacBook MSI" } }),
    (id) =>
      prisma.debt.update({
        where: { id },
        data: {
          linkedFinancialAccountId: tarjetaBbva.id,
          type: "INSTALLMENT_PURCHASE",
          originalAmount: new Prisma.Decimal(36000),
          currentBalance: new Prisma.Decimal(24000),
          monthlyPayment: new Prisma.Decimal(3000),
          currency: "MXN",
          dueDay: 10,
          installmentsTotal: 12,
          installmentsPaid: 4,
          status: "ACTIVE",
        },
      }),
    () =>
      prisma.debt.create({
        data: {
          userId: user.id,
          linkedFinancialAccountId: tarjetaBbva.id,
          name: "MacBook MSI",
          type: "INSTALLMENT_PURCHASE",
          originalAmount: new Prisma.Decimal(36000),
          currentBalance: new Prisma.Decimal(24000),
          monthlyPayment: new Prisma.Decimal(3000),
          currency: "MXN",
          dueDay: 10,
          installmentsTotal: 12,
          installmentsPaid: 4,
        },
      }),
  );

  await upsertByUserAndName(
    () =>
      prisma.scheduledPayment.findFirst({
        where: { userId: user.id, name: "Netflix próximo pago" },
      }),
    (id) =>
      prisma.scheduledPayment.update({
        where: { id },
        data: {
          paymentFinancialAccountId: tarjetaBbva.id,
          amount: new Prisma.Decimal(299),
          currency: "MXN",
          dueDate: daysFromToday(7),
          frequency: "MONTHLY",
          category: "Entretenimiento",
          status: "PENDING",
          linkedSubscriptionId: netflix.id,
          linkedDebtId: null,
          linkedLoanGivenId: null,
        },
      }),
    () =>
      prisma.scheduledPayment.create({
        data: {
          userId: user.id,
          paymentFinancialAccountId: tarjetaBbva.id,
          name: "Netflix próximo pago",
          amount: new Prisma.Decimal(299),
          currency: "MXN",
          dueDate: daysFromToday(7),
          frequency: "MONTHLY",
          category: "Entretenimiento",
          linkedSubscriptionId: netflix.id,
        },
      }),
  );

  await upsertByUserAndName(
    () =>
      prisma.scheduledPayment.findFirst({
        where: { userId: user.id, name: "MacBook MSI próximo pago" },
      }),
    (id) =>
      prisma.scheduledPayment.update({
        where: { id },
        data: {
          paymentFinancialAccountId: tarjetaBbva.id,
          amount: new Prisma.Decimal(3000),
          currency: "MXN",
          dueDate: daysFromToday(3),
          frequency: "MONTHLY",
          category: "Deuda",
          status: "PENDING",
          linkedDebtId: macbookDebt.id,
          linkedSubscriptionId: null,
          linkedLoanGivenId: null,
        },
      }),
    () =>
      prisma.scheduledPayment.create({
        data: {
          userId: user.id,
          paymentFinancialAccountId: tarjetaBbva.id,
          name: "MacBook MSI próximo pago",
          amount: new Prisma.Decimal(3000),
          currency: "MXN",
          dueDate: daysFromToday(3),
          frequency: "MONTHLY",
          category: "Deuda",
          linkedDebtId: macbookDebt.id,
        },
      }),
  );

  await upsertByUserAndName(
    () =>
      prisma.loanGiven.findFirst({
        where: { userId: user.id, borrowerName: "Carlos" },
      }),
    (id) =>
      prisma.loanGiven.update({
        where: { id },
        data: {
          principalAmount: new Prisma.Decimal(5000),
          amountRepaid: new Prisma.Decimal(1500),
          currency: "MXN",
          expectedReturnDate: daysFromToday(30),
          status: "PARTIALLY_REPAID",
          notes: "Prestamo demo para validar resumen del dashboard",
        },
      }),
    () =>
      prisma.loanGiven.create({
        data: {
          userId: user.id,
          borrowerName: "Carlos",
          principalAmount: new Prisma.Decimal(5000),
          amountRepaid: new Prisma.Decimal(1500),
          currency: "MXN",
          expectedReturnDate: daysFromToday(30),
          status: "PARTIALLY_REPAID",
          notes: "Prestamo demo para validar resumen del dashboard",
        },
      }),
  );

  await upsertByUserAndName(
    () =>
      prisma.goal.findFirst({
        where: { userId: user.id, name: { in: ["Fondo Viaje Japón", "Fondo Viaje Japon"] } },
      }),
    (id) =>
      prisma.goal.update({
        where: { id },
        data: {
          name: "Fondo Viaje Japón",
          category: "TRAVEL",
          targetAmount: new Prisma.Decimal(120000),
          currentAmount: new Prisma.Decimal(15000),
          currency: "MXN",
          priority: 1,
          status: "ACTIVE",
        },
      }),
    () =>
      prisma.goal.create({
        data: {
          userId: user.id,
          name: "Fondo Viaje Japón",
          category: "TRAVEL",
          targetAmount: new Prisma.Decimal(120000),
          currentAmount: new Prisma.Decimal(15000),
          currency: "MXN",
          priority: 1,
        },
      }),
  );

  await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: {
      inAppEnabled: true,
      emailEnabled: true,
      pushEnabled: false,
      defaultDaysBeforeDue: 3,
    },
    create: {
      userId: user.id,
      inAppEnabled: true,
      emailEnabled: true,
      pushEnabled: false,
      defaultDaysBeforeDue: 3,
    },
  });

  console.info(`Seed completed for ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
