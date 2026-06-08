import type { FormEvent } from "react";
import type { LoanGiven } from "@/types/finance";

export type LoanGivenFormState = {
  personName: string;
  totalAmount: string;
  amountPaid: string;
  loanDate: string;
  expectedIncomeDate: string;
  estimatedFullRepaymentDate: string;
  paymentFrequency: LoanGiven["paymentFrequency"];
  notes: string;
};

type LoanGivenFormProps = {
  form: LoanGivenFormState;
  errors: string[];
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: <K extends keyof LoanGivenFormState>(
    key: K,
    value: LoanGivenFormState[K],
  ) => void;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  containerClassName?: string;
};

const frequencyOptions: Array<{
  value: LoanGiven["paymentFrequency"];
  label: string;
}> = [
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quincenal" },
  { value: "monthly", label: "Mensual" },
  { value: "custom", label: "Personalizada" },
];

export const initialLoanGivenFormState: LoanGivenFormState = {
  personName: "",
  totalAmount: "",
  amountPaid: "",
  loanDate: "",
  expectedIncomeDate: "",
  estimatedFullRepaymentDate: "",
  paymentFrequency: "monthly",
  notes: "",
};

export function loanToFormState(loan: LoanGiven): LoanGivenFormState {
  return {
    personName: loan.personName,
    totalAmount: String(loan.totalAmount),
    amountPaid: String(loan.amountPaid),
    loanDate: loan.loanDate,
    expectedIncomeDate: loan.expectedIncomeDate,
    estimatedFullRepaymentDate: loan.estimatedFullRepaymentDate,
    paymentFrequency: loan.paymentFrequency,
    notes: loan.notes,
  };
}

export function LoanGivenForm({
  form,
  errors,
  isEditing,
  onCancel,
  onSubmit,
  onUpdate,
  title,
  subtitle,
  submitLabel,
  containerClassName = "rounded-2xl border border-border bg-card p-5",
}: LoanGivenFormProps) {
  return (
    <section className={containerClassName}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-ink">
            {title ?? (isEditing ? "Editar préstamo" : "Agregar préstamo")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {subtitle ?? "Registra dinero prestado sin contarlo como disponible."}
          </p>
        </div>
      </div>

      {errors.length > 0 ? (
        <div className="mb-5 rounded-2xl border border-expense/30 bg-expense/10 p-4">
          {errors.map((error) => (
            <p key={error} className="text-sm text-expense">
              {error}
            </p>
          ))}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-secondary">Nombre de la persona</span>
          <input
            value={form.personName}
            onChange={(event) => onUpdate("personName", event.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
            placeholder="Ej. Andrea"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-secondary">Monto prestado</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.totalAmount}
            onChange={(event) => onUpdate("totalAmount", event.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
            placeholder="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-secondary">Cantidad ya pagada</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amountPaid}
            onChange={(event) => onUpdate("amountPaid", event.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
            placeholder="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-secondary">Fecha del préstamo</span>
          <input
            type="date"
            value={form.loanDate}
            onChange={(event) => onUpdate("loanDate", event.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-secondary">Próximo ingreso estimado</span>
          <input
            type="date"
            value={form.expectedIncomeDate}
            onChange={(event) => onUpdate("expectedIncomeDate", event.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-secondary">Fecha estimada de liquidación</span>
          <input
            type="date"
            value={form.estimatedFullRepaymentDate}
            onChange={(event) =>
              onUpdate("estimatedFullRepaymentDate", event.target.value)
            }
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-secondary">Frecuencia de pago</span>
          <select
            value={form.paymentFrequency}
            onChange={(event) =>
              onUpdate(
                "paymentFrequency",
                event.target.value as LoanGiven["paymentFrequency"],
              )
            }
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary"
          >
            {frequencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-secondary">Notas</span>
          <textarea
            value={form.notes}
            onChange={(event) => onUpdate("notes", event.target.value)}
            className="min-h-24 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary"
            placeholder="Acuerdo, contexto o recordatorio"
          />
        </label>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end md:col-span-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-secondary transition hover:border-primary hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            {submitLabel ?? (isEditing ? "Guardar cambios" : "Guardar préstamo")}
          </button>
        </div>
      </form>
    </section>
  );
}
