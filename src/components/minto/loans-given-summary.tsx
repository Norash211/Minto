import { formatMoney } from "@/lib/money";

type LoansGivenSummaryProps = {
  totalLoansGiven: number;
};

export function LoansGivenSummary({ totalLoansGiven }: LoansGivenSummaryProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 h-1 w-8 rounded-full bg-savings" />
      <p className="text-sm font-medium text-secondary">Dinero que te deben</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[0] text-ink">
        {formatMoney(totalLoansGiven)}
      </h2>
      <p className="mt-2 text-sm leading-5 text-muted">
        Dinero esperado, todavía no disponible.
      </p>
    </section>
  );
}
