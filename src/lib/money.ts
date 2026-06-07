export function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSignedMoney(amount: number) {
  const formatted = formatMoney(Math.abs(amount));

  return amount < 0 ? `-${formatted}` : formatted;
}

export function percentOf(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.min(Math.round((value / total) * 100), 100);
}
