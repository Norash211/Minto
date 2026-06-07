import { formatMoney } from "@/lib/money";

type LoansGivenSummaryProps = {
  totalLoansGiven?: number;
  totalLent?: number;
  totalRecovered?: number;
  pendingRecovery?: number;
  activeLoans?: number;
  lateLoans?: number;
};

export function LoansGivenSummary({
  totalLoansGiven,
  totalLent,
  totalRecovered,
  pendingRecovery,
  activeLoans,
  lateLoans,
}: LoansGivenSummaryProps) {
  if (
    totalLent === undefined ||
    totalRecovered === undefined ||
    pendingRecovery === undefined ||
    activeLoans === undefined ||
    lateLoans === undefined
  ) {
    return (
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 h-1 w-8 rounded-full bg-savings" />
        <p className="text-sm font-medium text-secondary">Dinero que te deben</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[0] text-ink">
          {formatMoney(totalLoansGiven ?? 0)}
        </h2>
        <p className="mt-2 text-sm leading-5 text-muted">
          Dinero esperado, todavía no disponible.
        </p>
      </section>
    );
  }

  const cards = [
    {
      label: "Total prestado",
      value: formatMoney(totalLent),
      accent: "bg-savings",
    },
    {
      label: "Total recuperado",
      value: formatMoney(totalRecovered),
      accent: "bg-income",
    },
    {
      label: "Pendiente por recuperar",
      value: formatMoney(pendingRecovery),
      accent: "bg-primary",
    },
    {
      label: "Préstamos activos",
      value: String(activeLoans),
      accent: "bg-savings",
    },
    {
      label: "Atrasados",
      value: String(lateLoans),
      accent: "bg-debt",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <section key={card.label} className="rounded-2xl border border-border bg-card p-5">
          <div className={`mb-4 h-1 w-8 rounded-full ${card.accent}`} />
          <p className="text-sm font-medium text-secondary">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-[0] text-ink">
            {card.value}
          </p>
        </section>
      ))}
    </div>
  );
}
