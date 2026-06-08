import { formatMoney } from "@/lib/money";
import type { UpcomingPayment } from "@/types/finance";

type UpcomingPaymentsProps = {
  payments: UpcomingPayment[];
};

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-ink">Pagos próximos</h2>
        <p className="mt-1 text-sm text-muted">Compromisos cercanos</p>
      </div>

      {payments.length > 0 ? (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">{payment.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {payment.bucket} · {payment.dueDate}
                </p>
              </div>
              <p className="text-right font-semibold text-ink">
                {formatMoney(payment.amount)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
          No hay pagos próximos.
        </p>
      )}
    </section>
  );
}
