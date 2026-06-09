import { z } from "zod";

export const accountTypeOptions = [
  "CHECKING",
  "SAVINGS",
  "CASH",
  "DIGITAL_WALLET",
  "CREDIT_CARD",
  "INVESTMENT",
] as const;

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

const moneyAmount = z.coerce.number().finite().min(0);
const optionalMoneyAmount = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().finite().min(0).optional(),
);
const dayOfMonth = z.coerce.number().int().min(1).max(31);
const optionalDayOfMonth = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().int().min(1).max(31).optional(),
);

export const createAccountSchema = z
  .object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres."),
    type: z.enum(accountTypeOptions),
    currency: z.string().trim().min(3).max(3).transform((value) => value.toUpperCase()),
    notes: optionalText,
    currentBalance: moneyAmount,
    creditLimit: optionalMoneyAmount,
    statementDay: optionalDayOfMonth,
    paymentDueDay: optionalDayOfMonth,
  })
  .superRefine((account, ctx) => {
    if (account.type !== "CREDIT_CARD") {
      return;
    }

    if (account.creditLimit === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "El límite de crédito es requerido.",
        path: ["creditLimit"],
      });
    }

    if (account.statementDay === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "El día de corte es requerido.",
        path: ["statementDay"],
      });
    }

    if (account.paymentDueDay === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "El día límite de pago es requerido.",
        path: ["paymentDueDay"],
      });
    }

    if (account.creditLimit !== undefined && account.creditLimit < account.currentBalance) {
      ctx.addIssue({
        code: "custom",
        message: "El límite de crédito debe ser mayor o igual a la deuda actual.",
        path: ["creditLimit"],
      });
    }
  });

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
