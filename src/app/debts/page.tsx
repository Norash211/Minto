import { AppShell } from "@/components/layout/app-shell";
import { DebtCard } from "@/components/minto/debt-card";
import { DebtsSummary } from "@/components/minto/debts-summary";
import { debtDueSoonMoney, debts, totalDebtOwed } from "@/data/mock-data";

export default function DebtsPage() {
  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-sm font-medium text-muted">Deudas</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
          Dinero que debes
        </h1>
      </section>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <DebtsSummary
          totalDebtOwed={totalDebtOwed}
          debtDueSoonMoney={debtDueSoonMoney}
        />

        {debts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {debts.map((debt) => (
              <DebtCard key={debt.id} debt={debt} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted">
            No hay deudas registradas.
          </p>
        )}
      </div>
    </AppShell>
  );
}
