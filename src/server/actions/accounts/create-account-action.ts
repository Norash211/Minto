"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { requireCurrentUser } from "@/server/auth";
import { createAccountSchema } from "@/features/accounts/schemas/create-account-schema";

export type CreateAccountActionState = {
  error?: string;
  success?: boolean;
};

const validationError = "Revisa los datos de la cuenta e inténtalo de nuevo.";
const createError = "No pudimos crear la cuenta. Inténtalo de nuevo.";

export async function createAccountAction(
  _previousState: CreateAccountActionState,
  formData: FormData,
): Promise<CreateAccountActionState> {
  const user = await requireCurrentUser();
  const parsed = createAccountSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    currency: formData.get("currency") || "MXN",
    notes: formData.get("notes"),
    currentBalance: formData.get("currentBalance") || 0,
    creditLimit: formData.get("creditLimit"),
    statementDay: formData.get("statementDay"),
    paymentDueDay: formData.get("paymentDueDay"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? validationError };
  }

  const account = parsed.data;
  const isCreditCard = account.type === "CREDIT_CARD";
  const openingDirection = isCreditCard ? "OUT" : "IN";
  const openingDescription = isCreditCard ? "Saldo inicial tarjeta" : "Saldo inicial";

  try {
    await prisma.$transaction(async (tx) => {
      const financialAccount = await tx.financialAccount.create({
        data: {
          userId: user.id,
          name: account.name,
          type: account.type,
          initialBalance: account.currentBalance,
          currentBalance: account.currentBalance,
          currency: account.currency,
          notes: account.notes,
          creditLimit: isCreditCard ? account.creditLimit : undefined,
          statementDay: isCreditCard ? account.statementDay : undefined,
          paymentDueDay: isCreditCard ? account.paymentDueDay : undefined,
        },
      });

      if (account.currentBalance <= 0) {
        return;
      }

      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "OPENING_BALANCE",
          currency: account.currency,
          date: new Date(),
          description: openingDescription,
          entries: {
            create: {
              financialAccountId: financialAccount.id,
              direction: openingDirection,
              amount: account.currentBalance,
            },
          },
        },
      });
    });
  } catch {
    return { error: createError };
  }

  revalidatePath("/");
  revalidatePath("/accounts");

  return { success: true };
}
