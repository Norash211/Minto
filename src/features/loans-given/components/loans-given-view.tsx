import { AppShell } from "@/components/layout/app-shell";
import type { GetLoansGivenResult } from "@/server/queries";
import { toLoansGivenViewLoans } from "../utils/loans-given-adapters";
import { LoansGivenManager } from "./loans-given-manager";

type LoansGivenViewProps = {
  loansGiven: GetLoansGivenResult;
};

export function LoansGivenView({ loansGiven: sourceLoansGiven }: LoansGivenViewProps) {
  const loansGiven = toLoansGivenViewLoans(sourceLoansGiven);

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
