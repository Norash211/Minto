import { AppShell } from "@/components/layout/app-shell";
import { loansGiven } from "@/data/mock-data";
import { LoansGivenManager } from "./loans-given-manager";

export function LoansGivenView() {
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
