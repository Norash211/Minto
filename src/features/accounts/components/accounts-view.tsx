import { AppShell } from "@/components/layout/app-shell";
import { formatMoney } from "@/lib/money";
import type { GetAccountsResult } from "@/server/queries";
import { toAccountsViewAccounts } from "../utils/accounts-adapters";
import { CreateAccountDialog } from "./create-account-dialog";

const toneClasses = {
  sage: "bg-sage",
  clay: "bg-clay",
  gold: "bg-gold",
  ink: "bg-ink",
};

type AccountsViewProps = {
  accounts: GetAccountsResult;
};

export function AccountsView({ accounts: sourceAccounts }: AccountsViewProps) {
  const accounts = toAccountsViewAccounts(sourceAccounts);

  return (
    <AppShell>
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Cuentas</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
            Dónde vive tu dinero
          </h1>
        </div>
        <CreateAccountDialog />
      </section>

      {accounts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {accounts.map((account) => (
            <article
              key={account.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div
                className={`mb-8 h-10 w-10 rounded-xl ${toneClasses[account.tone]}`}
              />
              <p className="text-sm text-muted">{account.institution}</p>
              <h2 className="mt-1 text-lg font-semibold text-ink">{account.name}</h2>
              <p className="mt-5 text-sm text-muted">
                {account.balanceLabel ?? "Saldo disponible"}
              </p>
              <p
                className={`mt-1 text-2xl font-semibold tracking-[0] ${
                  account.isCreditCard ? "text-debt" : "text-ink"
                }`}
              >
                {formatMoney(account.balance)}
              </p>
              {account.isCreditCard ? (
                <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted">Disponible</span>
                    <span className="font-medium text-income">
                      {formatMoney(account.availableCredit ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted">Límite</span>
                    <span className="font-medium text-secondary">
                      {formatMoney(account.creditLimit ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted">Corte</span>
                    <span className="font-medium text-secondary">
                      {account.statementDay ? `Día ${account.statementDay}` : "Sin dato"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted">Pago límite</span>
                    <span className="font-medium text-secondary">
                      {account.paymentDueDay ? `Día ${account.paymentDueDay}` : "Sin dato"}
                    </span>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-ink">Aún no hay cuentas registradas.</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Agrega tu primera cuenta para empezar a calcular tu dinero disponible.
          </p>
        </div>
      )}
    </AppShell>
  );
}
