import type {
  Account,
  Bucket,
  Debt,
  LoanGiven,
  MonthlyForecast,
  Transaction,
  UpcomingPayment,
} from "@/types/finance";

export const accounts: Account[] = [
  {
    id: "acc-1",
    name: "Cuenta diaria",
    institution: "BBVA",
    balance: 32450,
    tone: "sage",
  },
  {
    id: "acc-2",
    name: "Ahorro flexible",
    institution: "Nu",
    balance: 48100,
    tone: "gold",
  },
  {
    id: "acc-3",
    name: "Efectivo",
    institution: "Personal",
    balance: 4200,
    tone: "clay",
  },
];

export const buckets: Bucket[] = [
  {
    id: "bucket-rent",
    name: "Renta",
    description: "Departamento y servicios base",
    balance: 18500,
    target: 18500,
    committed: true,
  },
  {
    id: "bucket-food",
    name: "Comida",
    description: "Súper, cafés y comidas fuera",
    balance: 7200,
    target: 9000,
    committed: true,
  },
  {
    id: "bucket-mobility",
    name: "Movilidad",
    description: "Transporte, gasolina y apps",
    balance: 3600,
    target: 4500,
    committed: true,
  },
  {
    id: "bucket-growth",
    name: "Crecimiento",
    description: "Cursos, libros y proyectos",
    balance: 5400,
    target: 8000,
    committed: false,
  },
  {
    id: "bucket-free",
    name: "Libre",
    description: "Disponible para decidir hoy",
    balance: 48150,
    committed: false,
  },
];

export const upcomingPayments: UpcomingPayment[] = [
  {
    id: "pay-1",
    name: "Renta junio",
    dueDate: "2026-06-08",
    amount: 16500,
    bucket: "Renta",
  },
  {
    id: "pay-2",
    name: "Internet",
    dueDate: "2026-06-11",
    amount: 649,
    bucket: "Renta",
  },
  {
    id: "pay-3",
    name: "Super semanal",
    dueDate: "2026-06-13",
    amount: 2200,
    bucket: "Comida",
  },
];

export const debts: Debt[] = [
  {
    id: "debt-card",
    name: "Tarjeta de crédito",
    lender: "BBVA",
    kind: "credit_card",
    totalOwed: 18400,
    dueSoonAmount: 6200,
    dueDate: "2026-06-17",
    status: "active",
  },
  {
    id: "debt-phone",
    name: "Compra a meses",
    lender: "Liverpool",
    kind: "installment",
    totalOwed: 9600,
    dueSoonAmount: 1600,
    dueDate: "2026-06-21",
    status: "active",
  },
  {
    id: "debt-personal",
    name: "Préstamo personal",
    lender: "Familiar",
    kind: "personal_loan",
    totalOwed: 12000,
    dueSoonAmount: 0,
    dueDate: "2026-07-10",
    status: "paused",
  },
];

export const loansGiven: LoanGiven[] = [
  {
    id: "loan-friend",
    personName: "Sofia",
    totalAmount: 8000,
    amountPaid: 4500,
    remainingAmount: 3500,
    loanDate: "2026-05-10",
    expectedIncomeDate: "2026-06-20",
    estimatedFullRepaymentDate: "2026-07-20",
    paymentFrequency: "monthly",
    status: "active",
    notes: "Apoyo temporal",
  },
  {
    id: "loan-family",
    personName: "Carlos",
    totalAmount: 12000,
    amountPaid: 4800,
    remainingAmount: 7200,
    loanDate: "2026-04-18",
    expectedIncomeDate: "2026-06-01",
    estimatedFullRepaymentDate: "2026-09-01",
    paymentFrequency: "monthly",
    status: "late",
    notes: "Anticipo familiar",
  },
  {
    id: "loan-coworker",
    personName: "Mariana",
    totalAmount: 2500,
    amountPaid: 2500,
    remainingAmount: 0,
    loanDate: "2026-03-02",
    expectedIncomeDate: "2026-05-15",
    estimatedFullRepaymentDate: "2026-05-15",
    paymentFrequency: "custom",
    status: "completed",
    notes: "Liquidado",
  },
];

export const recentTransactions: Transaction[] = [
  {
    id: "txn-1",
    merchant: "Cafetería Blend",
    category: "Comida",
    amount: -168,
    date: "2026-06-05",
    account: "Cuenta diaria",
  },
  {
    id: "txn-2",
    merchant: "Nómina",
    category: "Ingreso",
    amount: 42000,
    date: "2026-06-04",
    account: "Cuenta diaria",
  },
  {
    id: "txn-3",
    merchant: "Uber",
    category: "Movilidad",
    amount: -124,
    date: "2026-06-03",
    account: "Cuenta diaria",
  },
  {
    id: "txn-4",
    merchant: "Casa del Libro",
    category: "Crecimiento",
    amount: -480,
    date: "2026-06-02",
    account: "Ahorro flexible",
  },
];

export const monthlyForecast: MonthlyForecast = {
  month: "Junio 2026",
  expectedIncome: 42000,
  expectedCommitted: 55949,
  expectedFreeMoney: -13949,
};

export const totalMoney = accounts.reduce((total, account) => total + account.balance, 0);
export const committedBucketMoney = buckets
  .filter((bucket) => bucket.committed)
  .reduce((total, bucket) => total + bucket.balance, 0);
export const scheduledPaymentMoney = upcomingPayments.reduce(
  (total, payment) => total + payment.amount,
  0,
);
export const debtDueSoonMoney = debts
  .filter((debt) => debt.status === "active")
  .reduce((total, debt) => total + debt.dueSoonAmount, 0);
export const committedMoney =
  committedBucketMoney + scheduledPaymentMoney + debtDueSoonMoney;
export const freeMoney = totalMoney - committedMoney;
export const totalDebtOwed = debts
  .filter((debt) => debt.status !== "paid")
  .reduce((total, debt) => total + debt.totalOwed, 0);
export const totalLoansGiven = loansGiven
  .filter((loan) => loan.status !== "completed")
  .reduce((total, loan) => total + loan.remainingAmount, 0);
