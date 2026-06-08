"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  Archive,
  ArrowRightLeft,
  HandCoins,
  Home,
  TrendingUp,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/accounts", label: "Cuentas", icon: WalletCards },
  { href: "/buckets", label: "Apartados", icon: Archive },
  { href: "/transactions", label: "Movimientos", icon: ArrowRightLeft },
  { href: "/forecast", label: "Proyección", icon: TrendingUp },
  { href: "/debts", label: "Deudas", icon: AlertCircle },
  { href: "/loans-given", label: "Dinero prestado", icon: HandCoins },
];

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const sidebarWidth = isCollapsed ? "lg:w-20" : "lg:w-[280px]";
  const contentOffset = isCollapsed ? "lg:ml-20" : "lg:ml-[280px]";

  return (
    <main className="min-h-screen w-full bg-background text-ink">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <aside
          className={`border-b border-border bg-surface transition-[width] duration-200 ease-out lg:fixed lg:inset-y-0 lg:left-0 lg:border-b-0 lg:border-r ${sidebarWidth}`}
        >
          <div className="flex h-full flex-col p-4 lg:p-5">
            <div className="flex items-center justify-between gap-2">
              <Link
                href="/"
                className={`flex min-w-0 items-center gap-3 px-2 py-2 ${
                  isCollapsed ? "lg:justify-center" : ""
                }`}
                title="Minto"
              >
                <Image
                  src="/brand/minto-mark.png"
                  alt="Minto"
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 rounded-xl"
                  priority
                />
                <span className={`min-w-0 ${isCollapsed ? "lg:hidden" : ""}`}>
                  <span className="block truncate text-base font-semibold tracking-[0] text-ink">
                    Minto
                  </span>
                  <span className="block truncate text-xs text-muted">
                    Sistema financiero
                  </span>
                </span>
              </Link>

              <button
                type="button"
                aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                onClick={() => setIsCollapsed((current) => !current)}
                className="hidden h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-sm font-medium text-secondary transition hover:border-primary hover:text-ink lg:grid"
                title={isCollapsed ? "Expandir" : "Colapsar"}
              >
                {isCollapsed ? "›" : "‹"}
              </button>
            </div>

            <nav className="mt-4 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col lg:overflow-visible">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isCollapsed ? "lg:justify-center" : ""
                    } ${
                      isActive
                        ? "bg-card text-ink"
                        : "text-secondary hover:bg-card hover:text-ink"
                    }`}
                    title={item.label}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`shrink-0 ${isCollapsed ? "lg:h-5 lg:w-5" : ""}`}
                      size={18}
                      strokeWidth={1.8}
                    />
                    <span className={isCollapsed ? "lg:hidden" : ""}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div
              className={`mt-auto hidden rounded-2xl border border-border bg-card p-4 lg:block ${
                isCollapsed ? "lg:hidden" : ""
              }`}
            >
              <p className="text-sm font-medium text-ink">Control tranquilo</p>
              <p className="mt-2 text-sm leading-5 text-muted">
                Entiende tu dinero sin ruido ni presión.
              </p>
            </div>
          </div>
        </aside>

        <section
          className={`min-w-0 flex-1 px-4 py-5 transition-[margin] duration-200 ease-out sm:px-6 lg:px-8 lg:py-7 ${contentOffset}`}
        >
          {children}
        </section>
      </div>
    </main>
  );
}
