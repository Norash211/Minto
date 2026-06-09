import { AppShell } from "@/components/layout/app-shell";
import { formatMoney } from "@/lib/money";
import type { GetForecastResult } from "@/server/queries";
import { toForecastViewModel } from "../utils/forecast-adapters";

type ForecastViewProps = {
  forecast: GetForecastResult;
};

export function ForecastView({ forecast: sourceForecast }: ForecastViewProps) {
  const forecast = toForecastViewModel(sourceForecast);
  const forecastRows = [
    ["Ingresos esperados", forecast.expectedIncome],
    ["Gastos esperados", forecast.expectedExpenses],
    ["Cambio neto esperado", forecast.netChange],
    ["Balance proyectado", forecast.projectedBalance],
  ] as const;

  return (
    <AppShell>
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <p className="text-sm font-medium text-muted">Proyección</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
          {forecast.month}
        </h1>

        {forecast.hasData ? (
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
        ) : (
          <p className="mt-8 rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
            Aún no hay datos suficientes para calcular una proyección.
          </p>
        )}
      </section>
    </AppShell>
  );
}
