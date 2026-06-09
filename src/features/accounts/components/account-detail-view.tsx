import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { formatMoney, formatSignedMoney } from "@/lib/money";
import type { GetAccountDetailResult } from "@/server/queries";
import { toAccountDetailViewModel } from "../utils/account-detail-adapters";

type AccountDetailViewProps = {
  accountDetail: GetAccountDetailResult;
};

export function AccountDetailView({ accountDetail }: AccountDetailViewProps) {
  const detail = toAccountDetailViewModel(accountDetail);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/accounts"
              className="text-sm font-medium text-secondary transition hover:text-ink"
            >
              Cuentas
            </Link>
            <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
              {detail.account.name}
            </h1>
            <p className="mt-2 text-sm text-muted">{detail.account.typeLabel}</p>
          </div>
          <span className="w-fit rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted">
            {detail.account.currency}
          </span>
        </section>

        {detail.account.isCreditCard ? (
          <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
            <SummaryCard
              accent="bg-debt"
              label="Deuda actual"
              value={formatMoney(detail.summary.debtAmount)}
            />
            <SummaryCard
              accent="bg-income"
              label="Disponible"
              value={formatMoney(detail.summary.availableCredit)}
            />
            <SummaryCard
              accent="bg-primary"
              label="Límite"
              value={formatMoney(detail.summary.creditLimit)}
            />
            <SummaryCard
              accent="bg-savings"
              label="Corte"
              value={
                detail.summary.statementDay
                  ? `Día ${detail.summary.statementDay}`
                  : "Sin dato"
              }
            />
            <SummaryCard
              accent="bg-savings"
              label="Pago límite"
              value={
                detail.summary.paymentDueDay
                  ? `Día ${detail.summary.paymentDueDay}`
                  : "Sin dato"
              }
            />
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              accent="bg-primary"
              label="Saldo actual"
              value={formatMoney(detail.summary.currentBalance)}
            />
            <SummaryCard
              accent="bg-income"
              label="Entradas"
              value={formatMoney(detail.summary.totalIn)}
            />
            <SummaryCard
              accent="bg-debt"
              label="Salidas"
              value={formatMoney(detail.summary.totalOut)}
            />
          </section>
        )}

        {detail.account.notes ? (
          <p className="rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-muted">
            {detail.account.notes}
          </p>
        ) : null}

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-medium text-ink">Movimientos</h2>
              <p className="mt-1 text-sm text-muted">
                {detail.summary.transactionCount} movimientos registrados
              </p>
            </div>
          </div>

          {detail.transactions.length > 0 ? (
            <div className="divide-y divide-border">
              {detail.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-[1fr_auto] gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {transaction.description}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {transaction.category} · {transaction.accounts}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={
                        transaction.amount < 0
                          ? "font-semibold text-expense"
                          : "font-semibold text-income"
                      }
                    >
                      {formatSignedMoney(transaction.amount)}
                    </p>
                    <p className="mt-1 text-sm text-muted">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
              Aún no hay movimientos para esta cuenta.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}

type SummaryCardProps = {
  accent: string;
  label: string;
  value: string;
};

function SummaryCard({ accent, label, value }: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className={`mb-4 h-1 w-8 rounded-full ${accent}`} />
      <p className="text-sm font-medium text-secondary">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[0] text-ink">{value}</p>
    </article>
  );
}
