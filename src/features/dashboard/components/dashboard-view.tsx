import type { User } from "@prisma/client";
import { AppShell } from "@/components/layout/app-shell";
import { BucketCard } from "@/features/buckets/components/bucket-card";
import { DebtsSummary } from "@/features/debts/components/debts-summary";
import { LoansGivenSummary } from "@/features/loans-given/components/loans-given-summary";
import { RecentTransactions } from "@/features/transactions/components/recent-transactions";
import { formatMoney } from "@/lib/money";
import {
  getAccounts,
  getDashboardBuckets,
  getDashboardSummary,
  getDebtDueSoonSummary,
  getLoansGivenSummary,
  getRecentTransactions,
  getUpcomingPayments,
} from "@/server/queries";
import {
  toDashboardBuckets,
  toDashboardDebtSummary,
  toDashboardLoansGivenSummary,
  toDashboardMoneySummary,
  toDashboardMonthlyForecast,
  toDashboardRecentTransactions,
  toDashboardUpcomingPayments,
} from "../utils/dashboard-adapters";
import { MoneySummary } from "./money-summary";
import { UpcomingPayments } from "./upcoming-payments";

type DashboardViewProps = {
  user: User;
};

export async function DashboardView({ user }: DashboardViewProps) {
  const [
    summary,
    accounts,
    recentTransactions,
    buckets,
    upcomingPayments,
    debtDueSoonSummary,
    loansGivenSummary,
  ] = await Promise.all([
    getDashboardSummary(user.id),
    getAccounts(user.id),
    getRecentTransactions(user.id),
    getDashboardBuckets(user.id),
    getUpcomingPayments(user.id),
    getDebtDueSoonSummary(user.id),
    getLoansGivenSummary(user.id),
  ]);
  const moneySummary = toDashboardMoneySummary(summary, accounts);
  const debtSummary = toDashboardDebtSummary(summary, debtDueSoonSummary);
  const dashboardLoansGivenSummary = toDashboardLoansGivenSummary(loansGivenSummary);
  const monthlyForecast = toDashboardMonthlyForecast(summary, recentTransactions);
  const dashboardRecentTransactions = toDashboardRecentTransactions(recentTransactions).slice(0, 3);
  const dashboardBuckets = toDashboardBuckets(buckets);
  const dashboardUpcomingPayments = toDashboardUpcomingPayments(upcomingPayments);

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
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="max-w-md text-sm leading-6 text-muted sm:text-right">
              Una vista limpia de lo disponible, lo comprometido y lo que viene.
            </p>
          </div>
        </header>

        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-6">
            <MoneySummary
              totalMoney={moneySummary.totalMoney}
              committedMoney={moneySummary.committedMoney}
              freeMoney={moneySummary.freeMoney}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <DebtsSummary
                totalDebtOwed={debtSummary.totalDebtOwed}
                debtDueSoonMoney={debtSummary.debtDueSoonMoney}
              />
              <LoansGivenSummary
                totalLoansGiven={dashboardLoansGivenSummary.totalLoansGiven}
              />
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
              {dashboardBuckets.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                  {dashboardBuckets.map((bucket) => (
                    <BucketCard key={bucket.id} bucket={bucket} />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted">
                  Aún no hay apartados principales.
                </p>
              )}
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

            <UpcomingPayments payments={dashboardUpcomingPayments} />
            <RecentTransactions transactions={dashboardRecentTransactions} />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
