import type { LoanGiven } from "@/types/finance";
import { LoanGivenCard } from "./loan-given-card";

type LoanGivenListProps = {
  loans: LoanGiven[];
  getProgressPercentage: (loan: LoanGiven) => number;
  onEdit: (loan: LoanGiven) => void;
  onMarkCompleted: (loanId: string) => void;
};

export function LoanGivenList({
  loans,
  getProgressPercentage,
  onEdit,
  onMarkCompleted,
}: LoanGivenListProps) {
  if (loans.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium text-ink">No hay préstamos en esta vista</p>
        <p className="mt-2 text-sm text-muted">
          Cuando registres o actualices préstamos, aparecerán aquí según su estado.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {loans.map((loan) => (
        <LoanGivenCard
          key={loan.id}
          loan={loan}
          progressPercentage={getProgressPercentage(loan)}
          onEdit={onEdit}
          onMarkCompleted={onMarkCompleted}
        />
      ))}
    </div>
  );
}
