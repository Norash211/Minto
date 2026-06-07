import { AppShell } from "@/components/layout/app-shell";
import { LoanGivenCard } from "@/components/minto/loan-given-card";
import { LoansGivenSummary } from "@/components/minto/loans-given-summary";
import { loansGiven, totalLoansGiven } from "@/lib/mock-data";

export default function LoansGivenPage() {
  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-sm font-medium text-muted">Dinero prestado</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
          Dinero esperado, todavía no disponible
        </h1>
      </section>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <LoansGivenSummary totalLoansGiven={totalLoansGiven} />

        {loansGiven.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {loansGiven.map((loan) => (
              <LoanGivenCard key={loan.id} loan={loan} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted">
            No hay dinero prestado registrado.
          </p>
        )}
      </div>
    </AppShell>
  );
}
