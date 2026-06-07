import { formatMoney } from "@/lib/money";
import type { LoanGiven } from "@/lib/types";

type LoanGivenCardProps = {
  loan: LoanGiven;
};

export function LoanGivenCard({ loan }: LoanGivenCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Persona</p>
          <h3 className="mt-1 text-sm font-medium text-ink">{loan.borrower}</h3>
        </div>
        <span className="rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-medium text-secondary">
          {loan.status === "late" ? "Atrasado" : "Esperado"}
        </span>
      </div>

      <p className="mt-5 text-2xl font-semibold tracking-[0] text-ink">
        {formatMoney(loan.amountOwed)}
      </p>
      <p className="mt-2 text-sm leading-5 text-muted">{loan.note}</p>

      <div className="mt-5 border-t border-border pt-3 text-sm text-muted">
        Pago esperado · {loan.expectedRepaymentDate}
      </div>
    </article>
  );
}
