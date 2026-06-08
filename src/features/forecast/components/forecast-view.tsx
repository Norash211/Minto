import { AppShell } from "@/components/layout/app-shell";
import { monthlyForecast } from "@/data/mock-data";
import { formatMoney } from "@/lib/money";

const forecastRows = [
  ["Ingresos esperados", monthlyForecast.expectedIncome],
  ["Dinero comprometido esperado", monthlyForecast.expectedCommitted],
  ["Dinero libre esperado", monthlyForecast.expectedFreeMoney],
] as const;

export function ForecastView() {
  return (
    <AppShell>
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <p className="text-sm font-medium text-muted">Proyección</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
          {monthlyForecast.month}
        </h1>

        <div className="mt-8 divide-y divide-border">
          {forecastRows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <p className="text-muted">{label}</p>
              <p className="text-xl font-semibold text-ink">{formatMoney(value)}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
