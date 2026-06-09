import type { GetAccountsResult } from "@/server/queries";
import type { Account } from "@/types/finance";

const accountTypeLabels = {
  CHECKING: "Cuenta corriente",
  SAVINGS: "Ahorro",
  CASH: "Efectivo",
  DIGITAL_WALLET: "Billetera digital",
  CREDIT_CARD: "Tarjeta de crédito",
  INVESTMENT: "Inversión",
} satisfies Record<GetAccountsResult[number]["type"], string>;

const accountTypeTones = {
  CHECKING: "sage",
  SAVINGS: "gold",
  CASH: "clay",
  DIGITAL_WALLET: "ink",
  CREDIT_CARD: "clay",
  INVESTMENT: "sage",
} satisfies Record<GetAccountsResult[number]["type"], Account["tone"]>;

function decimalToNumber(value: { toNumber(): number }) {
  return value.toNumber();
}

export function toAccountsViewAccounts(accounts: GetAccountsResult): Account[] {
  return accounts.map((account) => ({
    id: account.id,
    name: account.name,
    institution: accountTypeLabels[account.type],
    balance: decimalToNumber(account.currentBalance),
    tone: accountTypeTones[account.type],
  }));
}
