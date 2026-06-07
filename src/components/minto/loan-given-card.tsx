import { formatMoney } from "@/lib/money";
import type { LoanGiven } from "@/lib/types";

type LoanGivenCardProps = {
  loan: LoanGiven;
  progressPercentage: number;
  onEdit: (loan: LoanGiven) => void;
  onMarkCompleted: (loanId: string) => void;
};

const frequencyLabels: Record<LoanGiven["paymentFrequency"], string> = {
  weekly: "Semanal",
  biweekly: "Quincenal",
  monthly: "Mensual",
  custom: "Personalizada",
};

const statusLabels: Record<LoanGiven["status"], string> = {
  active: "Activo",
  late: "Atrasado",
  completed: "Completado",
};

const statusClasses: Record<LoanGiven["status"], string> = {
  active: "border-primary/30 bg-primary/10 text-primary-hover",
  late: "border-debt/30 bg-debt/10 text-debt",
  completed: "border-income/30 bg-income/10 text-income",
};

export function LoanGivenCard({
  loan,
  progressPercentage,
  onEdit,
  onMarkCompleted,
}: LoanGivenCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Persona</p>
          <h3 className="mt-1 text-sm font-medium text-ink">{loan.personName}</h3>
        </div>
        <span
          className={`rounded-xl border px-2.5 py-1 text-xs font-medium ${statusClasses[loan.status]}`}
        >
          {statusLabels[loan.status]}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">Monto total</p>
          <p className="mt-1 text-lg font-semibold tracking-[0] text-ink">
            {formatMoney(loan.totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Pagado</p>
          <p className="mt-1 text-lg font-semibold tracking-[0] text-income">
            {formatMoney(loan.amountPaid)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Restante</p>
          <p className="mt-1 text-lg font-semibold tracking-[0] text-ink">
            {formatMoney(loan.remainingAmount)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">Progreso</p>
          <p className="text-sm font-medium text-secondary">{progressPercentage}%</p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-savings"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-muted">Próximo ingreso estimado</p>
          <p className="mt-1 text-secondary">{loan.expectedIncomeDate || "Sin fecha"}</p>
        </div>
        <div>
          <p className="text-muted">Pago final estimado</p>
          <p className="mt-1 text-secondary">
            {loan.estimatedFullRepaymentDate || "Sin fecha"}
          </p>
        </div>
        <div>
          <p className="text-muted">Fecha del préstamo</p>
          <p className="mt-1 text-secondary">{loan.loanDate}</p>
        </div>
        <div>
          <p className="text-muted">Frecuencia</p>
          <p className="mt-1 text-secondary">
            {frequencyLabels[loan.paymentFrequency]}
          </p>
        </div>
      </div>

      {loan.notes ? (
        <p className="mt-4 rounded-2xl border border-border bg-surface p-3 text-sm leading-5 text-muted">
          {loan.notes}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => onEdit(loan)}
          className="rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-secondary transition hover:border-primary hover:text-ink"
        >
          Editar
        </button>
        {loan.status !== "completed" ? (
          <button
            type="button"
            onClick={() => onMarkCompleted(loan.id)}
            className="rounded-xl border border-income/30 bg-income/10 px-3 py-2 text-sm font-medium text-income transition hover:border-income"
          >
            Marcar como completado
          </button>
        ) : null}
      </div>
    </article>
  );
}
