import { formatMoney } from "@/lib/money";

type MoneySummaryProps = {
  totalMoney: number;
  committedMoney: number;
  freeMoney: number;
};

export function MoneySummary({
  totalMoney,
  committedMoney,
  freeMoney,
}: MoneySummaryProps) {
  const items = [
    {
      label: "Dinero total",
      description: "Todo tu dinero disponible hoy",
      value: totalMoney,
      accent: "bg-primary",
    },
    {
      label: "Dinero comprometido",
      description: "Dinero ya apartado o comprometido",
      value: committedMoney,
      accent: "bg-debt",
    },
    {
      label: "Dinero libre",
      description: "Lo que realmente puedes usar",
      value: freeMoney,
      accent: "bg-income",
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-secondary">Disponible real</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[0] text-ink">
            {formatMoney(freeMoney)}
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted">
          Dinero libre = dinero total - dinero comprometido
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 2xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-surface p-4">
            <div className={`mb-4 h-1 w-8 rounded-full ${item.accent}`} />
            <p className="text-sm font-medium text-secondary">{item.label}</p>
            <p className="mt-1 min-h-10 text-sm leading-5 text-muted">
              {item.description}
            </p>
            <p className="mt-4 text-2xl font-semibold tracking-[0] text-ink">
              {formatMoney(item.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
