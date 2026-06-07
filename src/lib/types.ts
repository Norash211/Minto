export type MoneyAmount = number;

export type Account = {
  id: string;
  name: string;
  institution: string;
  balance: MoneyAmount;
  tone: "sage" | "clay" | "gold" | "ink";
};

export type Bucket = {
  id: string;
  name: string;
  description: string;
  balance: MoneyAmount;
  target?: MoneyAmount;
  committed: boolean;
};

export type Transaction = {
  id: string;
  merchant: string;
  category: string;
  amount: MoneyAmount;
  date: string;
  account: string;
};

export type UpcomingPayment = {
  id: string;
  name: string;
  dueDate: string;
  amount: MoneyAmount;
  bucket: string;
};

export type Debt = {
  id: string;
  name: string;
  lender: string;
  kind: "credit_card" | "personal_loan" | "installment";
  totalOwed: MoneyAmount;
  dueSoonAmount: MoneyAmount;
  dueDate: string;
  status: "active" | "paused" | "paid";
};

export type LoanGiven = {
  id: string;
  borrower: string;
  note: string;
  amountOwed: MoneyAmount;
  expectedRepaymentDate: string;
  status: "expected" | "late" | "repaid";
};

export type MonthlyForecast = {
  month: string;
  expectedIncome: MoneyAmount;
  expectedCommitted: MoneyAmount;
  expectedFreeMoney: MoneyAmount;
};
