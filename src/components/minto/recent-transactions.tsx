import { formatSignedMoney } from "@/lib/money";
import type { Transaction } from "@/lib/types";

type RecentTransactionsProps = {
  transactions: Transaction[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-ink">Movimientos recientes</h2>
          <p className="mt-1 text-sm text-muted">Últimos movimientos registrados</p>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="divide-y divide-border">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="grid grid-cols-[1fr_auto] gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium text-ink">{transaction.merchant}</p>
                <p className="mt-1 text-sm text-muted">
                  {transaction.category} · {transaction.account}
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
          Aún no hay movimientos registrados.
        </p>
      )}
    </section>
  );
}
