import Link from "next/link";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/accounts", label: "Cuentas" },
  { href: "/buckets", label: "Apartados" },
  { href: "/transactions", label: "Movimientos" },
  { href: "/forecast", label: "Proyección" },
  { href: "/debts", label: "Deudas" },
  { href: "/loans-given", label: "Dinero prestado" },
];

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-background text-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-64 lg:shrink-0">
          <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-4 shadow-soft">
            <Link href="/" className="flex items-center gap-3 px-2 py-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-sm font-semibold text-white">
                M
              </span>
              <span>
                <span className="block text-base font-semibold tracking-[0] text-ink">
                  Minto
                </span>
                <span className="block text-xs text-muted">Sistema financiero</span>
              </span>
            </Link>

            <nav className="mt-6 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium text-secondary transition hover:bg-card hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto hidden rounded-2xl border border-border bg-card p-4 lg:block">
              <p className="text-sm font-medium text-ink">Control tranquilo</p>
              <p className="mt-2 text-sm leading-5 text-muted">
                Entiende tu dinero sin ruido ni presión.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </main>
  );
}
