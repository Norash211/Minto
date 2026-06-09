import type { GetForecastResult } from "@/server/queries";

export function toForecastViewModel(forecast: GetForecastResult) {
  return {
    month: forecast.monthLabel,
    expectedIncome: forecast.expectedIncome,
    expectedExpenses: forecast.expectedExpenses,
    projectedBalance: forecast.projectedBalance,
    netChange: forecast.netChange,
    hasData: forecast.hasData,
  };
}
