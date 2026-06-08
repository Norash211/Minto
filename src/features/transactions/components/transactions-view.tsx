import { AppShell } from "@/components/layout/app-shell";
import { recentTransactions } from "@/data/mock-data";
import { RecentTransactions } from "./recent-transactions";

export function TransactionsView() {
  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-sm font-medium text-muted">Movimientos</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
          Actividad reciente
        </h1>
      </section>

      <RecentTransactions transactions={recentTransactions} />
    </AppShell>
  );
}
