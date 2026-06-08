import { AppShell } from "@/components/layout/app-shell";
import { BucketCard } from "@/components/minto/bucket-card";
import { MoneySummary } from "@/components/minto/money-summary";
import { RecentTransactions } from "@/components/minto/recent-transactions";
import { UpcomingPayments } from "@/components/minto/upcoming-payments";
import {
  buckets,
  committedMoney,
  debtDueSoonMoney,
  freeMoney,
  monthlyForecast,
  recentTransactions,
  totalDebtOwed,
  totalLoansGiven,
  totalMoney,
  upcomingPayments,
} from "@/data/mock-data";
import { DebtsSummary } from "@/features/debts";
import { LoansGivenSummary } from "@/features/loans-given/components/loans-given-summary";
import { formatMoney } from "@/lib/money";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-secondary">Inicio</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
              Entiende tu dinero de hoy
            </h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            Una vista limpia de lo disponible, lo comprometido y lo que viene.
          </p>
        </header>

        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-6">
            <MoneySummary
              totalMoney={totalMoney}
              committedMoney={committedMoney}
              freeMoney={freeMoney}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <DebtsSummary
                totalDebtOwed={totalDebtOwed}
                debtDueSoonMoney={debtDueSoonMoney}
              />
              <LoansGivenSummary totalLoansGiven={totalLoansGiven} />
            </div>

            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-ink">Apartados principales</h2>
                  <p className="mt-1 text-sm text-muted">
                    Donde el dinero ya tiene trabajo asignado
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                {buckets.slice(0, 4).map((bucket) => (
                  <BucketCard key={bucket.id} bucket={bucket} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="mb-4 h-1 w-8 rounded-full bg-primary" />
              <p className="text-sm font-medium text-secondary">Proyección mensual</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[0] text-ink">
                {monthlyForecast.month}
              </h2>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted">Ingresos</span>
                  <span className="font-semibold text-income">
                    {formatMoney(monthlyForecast.expectedIncome)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted">Comprometido</span>
                  <span className="font-semibold text-debt">
                    {formatMoney(monthlyForecast.expectedCommitted)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
                  <span className="text-sm text-muted">Libre proyectado</span>
                  <span className="font-semibold text-ink">
                    {formatMoney(monthlyForecast.expectedFreeMoney)}
                  </span>
                </div>
              </div>
            </section>

            <UpcomingPayments payments={upcomingPayments} />
            <RecentTransactions transactions={recentTransactions.slice(0, 3)} />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
