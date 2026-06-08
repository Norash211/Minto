"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { LoanGiven } from "@/types/finance";
import {
  initialLoanGivenFormState,
  LoanGivenForm,
  loanToFormState,
  type LoanGivenFormState,
} from "./loan-given-form";
import { LoanGivenList } from "./loan-given-list";
import { LoansGivenSummary } from "./loans-given-summary";

type LoansGivenManagerProps = {
  initialLoans: LoanGiven[];
};

type LoanFilter = "all" | LoanGiven["status"];

const filters: Array<{ value: LoanFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "late", label: "Atrasados" },
  { value: "completed", label: "Completados" },
];

function getTodayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateRemainingAmount(totalAmount: number, amountPaid: number) {
  return Math.max(totalAmount - amountPaid, 0);
}

function calculateProgressPercentage(totalAmount: number, amountPaid: number) {
  if (totalAmount <= 0) {
    return 0;
  }

  return Math.min(Math.round((amountPaid / totalAmount) * 100), 100);
}

function calculateStatus(
  remainingAmount: number,
  expectedIncomeDate: string,
): LoanGiven["status"] {
  if (remainingAmount === 0) {
    return "completed";
  }

  if (expectedIncomeDate && expectedIncomeDate < getTodayDate()) {
    return "late";
  }

  return "active";
}

function normalizeLoan(loan: LoanGiven): LoanGiven {
  const remainingAmount = calculateRemainingAmount(loan.totalAmount, loan.amountPaid);

  return {
    ...loan,
    remainingAmount,
    status: calculateStatus(remainingAmount, loan.expectedIncomeDate),
  };
}

function buildLoan(form: LoanGivenFormState, id = `loan-${Date.now()}`): LoanGiven {
  const totalAmount = Number(form.totalAmount);
  const amountPaid = Number(form.amountPaid || 0);
  const remainingAmount = calculateRemainingAmount(totalAmount, amountPaid);

  return {
    id,
    personName: form.personName.trim(),
    totalAmount,
    amountPaid,
    remainingAmount,
    loanDate: form.loanDate,
    expectedIncomeDate: form.expectedIncomeDate,
    estimatedFullRepaymentDate: form.estimatedFullRepaymentDate,
    paymentFrequency: form.paymentFrequency,
    status: calculateStatus(remainingAmount, form.expectedIncomeDate),
    notes: form.notes.trim(),
  };
}

export function LoansGivenManager({ initialLoans }: LoansGivenManagerProps) {
  const [loans, setLoans] = useState<LoanGiven[]>(initialLoans);
  const [form, setForm] = useState<LoanGivenFormState>(initialLoanGivenFormState);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<LoanFilter>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);

  const normalizedLoans = useMemo(() => loans.map(normalizeLoan), [loans]);

  const filteredLoans = useMemo(() => {
    if (activeFilter === "all") {
      return normalizedLoans;
    }

    return normalizedLoans.filter((loan) => loan.status === activeFilter);
  }, [activeFilter, normalizedLoans]);

  const summary = useMemo(() => {
    return normalizedLoans.reduce(
      (totals, loan) => ({
        totalLent: totals.totalLent + loan.totalAmount,
        totalRecovered: totals.totalRecovered + loan.amountPaid,
        pendingRecovery: totals.pendingRecovery + loan.remainingAmount,
        activeLoans: totals.activeLoans + (loan.status === "active" ? 1 : 0),
        lateLoans: totals.lateLoans + (loan.status === "late" ? 1 : 0),
      }),
      {
        totalLent: 0,
        totalRecovered: 0,
        pendingRecovery: 0,
        activeLoans: 0,
        lateLoans: 0,
      },
    );
  }, [normalizedLoans]);

  useEffect(() => {
    if (!isFormOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        resetForm();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormOpen]);

  function updateForm<K extends keyof LoanGivenFormState>(
    key: K,
    value: LoanGivenFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(initialLoanGivenFormState);
    setErrors([]);
    setEditingLoanId(null);
    setIsFormOpen(false);
  }

  function validateForm() {
    const nextErrors: string[] = [];
    const totalAmount = Number(form.totalAmount);
    const amountPaid = Number(form.amountPaid || 0);

    if (!form.personName.trim()) {
      nextErrors.push("El nombre de la persona es requerido.");
    }

    if (!totalAmount || totalAmount <= 0) {
      nextErrors.push("El monto prestado debe ser mayor a 0.");
    }

    if (amountPaid > totalAmount) {
      nextErrors.push("La cantidad ya pagada no puede ser mayor al monto prestado.");
    }

    if (!form.loanDate) {
      nextErrors.push("La fecha del préstamo es requerida.");
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (nextErrors.length > 0) {
      return;
    }

    if (editingLoanId) {
      setLoans((current) =>
        current.map((loan) =>
          loan.id === editingLoanId ? buildLoan(form, editingLoanId) : loan,
        ),
      );
    } else {
      setLoans((current) => [buildLoan(form), ...current]);
    }

    resetForm();
  }

  function startAddLoan() {
    setForm(initialLoanGivenFormState);
    setErrors([]);
    setEditingLoanId(null);
    setIsFormOpen(true);
  }

  function startEditLoan(loan: LoanGiven) {
    setForm(loanToFormState(loan));
    setErrors([]);
    setEditingLoanId(loan.id);
    setIsFormOpen(true);
  }

  function markLoanCompleted(loanId: string) {
    setLoans((current) =>
      current.map((loan) =>
        loan.id === loanId
          ? {
              ...loan,
              amountPaid: loan.totalAmount,
              remainingAmount: 0,
              status: "completed",
            }
          : loan,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-ink">Gestión de préstamos</h2>
          <p className="mt-1 text-sm text-muted">
            Alta, edición y seguimiento de dinero que te deben.
          </p>
        </div>
        <button
          type="button"
          onClick={startAddLoan}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          Agregar préstamo
        </button>
      </div>

      <LoansGivenSummary
        totalLent={summary.totalLent}
        totalRecovered={summary.totalRecovered}
        pendingRecovery={summary.pendingRecovery}
        activeLoans={summary.activeLoans}
        lateLoans={summary.lateLoans}
      />

      <section className="space-y-4">
        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-1">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={
                activeFilter === filter.value
                  ? "whitespace-nowrap rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white"
                  : "whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-secondary transition hover:bg-surface hover:text-ink"
              }
            >
              {filter.label}
            </button>
          ))}
        </div>

        <LoanGivenList
          loans={filteredLoans}
          getProgressPercentage={(loan) =>
            calculateProgressPercentage(loan.totalAmount, loan.amountPaid)
          }
          onEdit={startEditLoan}
          onMarkCompleted={markLoanCompleted}
        />
      </section>

      {isFormOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          onClick={resetForm}
        >
          <div
            className="max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <LoanGivenForm
              form={form}
              errors={errors}
              isEditing={Boolean(editingLoanId)}
              onCancel={resetForm}
              onSubmit={handleSubmit}
              onUpdate={updateForm}
              title={editingLoanId ? "Editar préstamo" : "Agregar préstamo"}
              subtitle={
                editingLoanId
                  ? "Actualiza los datos del préstamo registrado."
                  : "Registra dinero que prestaste y cuándo esperas recuperarlo."
              }
              submitLabel={editingLoanId ? "Guardar cambios" : "Guardar préstamo"}
              containerClassName="p-5 sm:p-6"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
