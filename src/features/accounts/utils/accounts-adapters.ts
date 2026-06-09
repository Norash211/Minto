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

function decimalToNumber(value: { toNumber(): number } | null | undefined) {
  return value ? value.toNumber() : undefined;
}

export function toAccountsViewAccounts(accounts: GetAccountsResult): Account[] {
  return accounts.map((account) => {
    const balance = decimalToNumber(account.currentBalance) ?? 0;
    const creditLimit = decimalToNumber(account.creditLimit);
    const isCreditCard = account.type === "CREDIT_CARD";

    return {
      id: account.id,
      name: account.name,
      institution: accountTypeLabels[account.type],
      balance,
      balanceLabel: isCreditCard ? "Deuda actual" : "Saldo disponible",
      availableCredit:
        isCreditCard && creditLimit !== undefined
          ? Math.max(creditLimit - balance, 0)
          : undefined,
      creditLimit,
      statementDay: account.statementDay ?? undefined,
      paymentDueDay: account.paymentDueDay ?? undefined,
      isCreditCard,
      tone: accountTypeTones[account.type],
    };
  });
}
