import { AppShell } from "@/components/layout/app-shell";
import type { GetRecentTransactionsResult } from "@/server/queries";
import { RecentTransactions } from "./recent-transactions";
import { toTransactionsViewTransactions } from "../utils/transactions-adapters";

type TransactionsViewProps = {
  transactions: GetRecentTransactionsResult;
};

export function TransactionsView({ transactions: sourceTransactions }: TransactionsViewProps) {
  const transactions = toTransactionsViewTransactions(sourceTransactions);

  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-sm font-medium text-muted">Movimientos</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
          Actividad reciente
        </h1>
      </section>

      <RecentTransactions transactions={transactions} />
    </AppShell>
  );
}
