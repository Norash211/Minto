import { AppShell } from "@/components/layout/app-shell";
import { accounts } from "@/data/mock-data";
import { formatMoney } from "@/lib/money";

const toneClasses = {
  sage: "bg-sage",
  clay: "bg-clay",
  gold: "bg-gold",
  ink: "bg-ink",
};

export function AccountsView() {
  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-sm font-medium text-muted">Cuentas</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
          Dónde vive tu dinero
        </h1>
      </section>

      {accounts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {accounts.map((account) => (
            <article
              key={account.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div
                className={`mb-8 h-10 w-10 rounded-xl ${toneClasses[account.tone]}`}
              />
              <p className="text-sm text-muted">{account.institution}</p>
              <h2 className="mt-1 text-lg font-semibold text-ink">{account.name}</h2>
              <p className="mt-5 text-2xl font-semibold tracking-[0] text-ink">
                {formatMoney(account.balance)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted">
          Aún no hay cuentas registradas.
        </p>
      )}
    </AppShell>
  );
}
