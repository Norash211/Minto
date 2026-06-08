import { formatMoney } from "@/lib/money";
import type { Debt } from "@/types/finance";

type DebtCardProps = {
  debt: Debt;
};

const debtKindLabels: Record<Debt["kind"], string> = {
  credit_card: "Tarjeta",
  personal_loan: "Préstamo personal",
  installment: "Compra a meses",
};

export function DebtCard({ debt }: DebtCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{debt.lender}</p>
          <h3 className="mt-1 text-sm font-medium text-ink">{debt.name}</h3>
        </div>
        <span className="rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-medium text-secondary">
          {debtKindLabels[debt.kind]}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm text-muted">Total por pagar</p>
          <p className="mt-2 text-xl font-semibold tracking-[0] text-ink">
            {formatMoney(debt.totalOwed)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Próximo pago</p>
          <p className="mt-2 text-xl font-semibold tracking-[0] text-debt">
            {formatMoney(debt.dueSoonAmount)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-3 text-sm text-muted">
        <span>{debt.status === "active" ? "Activa" : "Pausada"}</span>
        <span>{debt.dueDate}</span>
      </div>
    </article>
  );
}
