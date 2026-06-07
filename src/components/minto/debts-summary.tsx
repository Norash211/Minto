import { formatMoney } from "@/lib/money";

type DebtsSummaryProps = {
  totalDebtOwed: number;
  debtDueSoonMoney: number;
};

export function DebtsSummary({
  totalDebtOwed,
  debtDueSoonMoney,
}: DebtsSummaryProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 h-1 w-8 rounded-full bg-debt" />
      <p className="text-sm font-medium text-secondary">Lo que debes pagar</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[0] text-ink">
        {formatMoney(totalDebtOwed)}
      </h2>
      <p className="mt-2 text-sm leading-5 text-muted">
        Dinero que debes. Las deudas próximas cuentan como dinero comprometido.
      </p>

      <div className="mt-5 rounded-2xl border border-border bg-surface p-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted">Por pagar pronto</span>
          <span className="font-semibold text-debt">
            {formatMoney(debtDueSoonMoney)}
          </span>
        </div>
      </div>
    </section>
  );
}
