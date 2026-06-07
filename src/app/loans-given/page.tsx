import { AppShell } from "@/components/layout/app-shell";
import { LoansGivenManager } from "@/components/minto/loans-given-manager";
import { loansGiven } from "@/lib/mock-data";

export default function LoansGivenPage() {
  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-sm font-medium text-secondary">Dinero prestado</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
          Dinero prestado
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Dinero que te deben, pero que todavía no está disponible.
        </p>
      </section>

      <LoansGivenManager initialLoans={loansGiven} />
    </AppShell>
  );
}
