import { AppShell } from "@/components/layout/app-shell";
import { RecentTransactions } from "@/components/minto/recent-transactions";
import { recentTransactions } from "@/lib/mock-data";

export default function TransactionsPage() {
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
