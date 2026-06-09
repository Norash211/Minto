"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createAccountAction } from "@/server/actions/accounts/create-account-action";
import { accountTypeOptions } from "../schemas/create-account-schema";

const accountTypeLabels = {
  CHECKING: "Nómina / débito",
  SAVINGS: "Ahorro",
  CASH: "Efectivo",
  DIGITAL_WALLET: "Wallet digital",
  CREDIT_CARD: "Tarjeta de crédito",
  INVESTMENT: "Inversión",
} satisfies Record<(typeof accountTypeOptions)[number], string>;

export function CreateAccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountType, setAccountType] =
    useState<(typeof accountTypeOptions)[number]>("CHECKING");
  const [state, formAction, isPending] = useActionState(createAccountAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    formRef.current?.reset();
    setAccountType("CHECKING");
    setIsOpen(false);
  }, [state.success]);

  function closeDialog() {
    if (isPending) {
      return;
    }

    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
      >
        <Plus aria-hidden="true" size={18} strokeWidth={1.8} />
        Agregar cuenta
      </button>

      {isOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          onClick={closeDialog}
        >
          <div
            className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
              <div>
                <p className="text-sm font-medium text-secondary">Nueva cuenta</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
                  Agregar cuenta
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Registra dónde vive tu dinero para mantener tu balance real.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-surface text-secondary transition hover:border-primary hover:text-ink"
                aria-label="Cerrar"
              >
                <X aria-hidden="true" size={18} strokeWidth={1.8} />
              </button>
            </div>

            <form ref={formRef} action={formAction} className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm text-secondary">Nombre</span>
                  <input
                    name="name"
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
                    placeholder="Cuenta diaria"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm text-secondary">Tipo de cuenta</span>
                  <select
                    name="type"
                    value={accountType}
                    onChange={(event) =>
                      setAccountType(event.target.value as typeof accountType)
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
                  >
                    {accountTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {accountTypeLabels[type]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm text-secondary">Moneda</span>
                  <input
                    name="currency"
                    defaultValue="MXN"
                    required
                    maxLength={3}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm uppercase text-ink outline-none transition placeholder:text-muted focus:border-primary"
                  />
                </label>
              </div>

              {accountType === "CREDIT_CARD" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm text-secondary">Deuda actual</span>
                    <input
                      name="currentBalance"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue="0"
                      required
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm text-secondary">Límite de crédito</span>
                    <input
                      name="creditLimit"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm text-secondary">Día de corte</span>
                    <input
                      name="statementDay"
                      type="number"
                      min="1"
                      max="31"
                      required
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm text-secondary">Día límite de pago</span>
                    <input
                      name="paymentDueDay"
                      type="number"
                      min="1"
                      max="31"
                      required
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
                    />
                  </label>
                </div>
              ) : (
                <label className="block space-y-2">
                  <span className="text-sm text-secondary">Saldo actual</span>
                  <input
                    name="currentBalance"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue="0"
                    required
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
                  />
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-sm text-secondary">Notas opcionales</span>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
                  placeholder="Detalles útiles para identificar esta cuenta"
                />
              </label>

              {state.error && isOpen ? (
                <p className="rounded-xl border border-debt/20 bg-debt/10 px-3 py-2 text-sm text-debt">
                  {state.error}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={isPending}
                  className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-secondary transition hover:border-primary hover:text-ink disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Guardando..." : "Guardar cuenta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
