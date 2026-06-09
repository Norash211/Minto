"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/config/navigation";
import { logoutAction } from "@/server/auth/actions";

type ShellUser = {
  name: string | null;
  email: string;
};

type AppShellClientProps = {
  children: React.ReactNode;
  user: ShellUser | null;
};

function getUserInitial(user: ShellUser | null) {
  const label = user?.name?.trim() || user?.email;

  return label ? label.charAt(0).toUpperCase() : "M";
}

export function AppShellClient({ children, user }: AppShellClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const sidebarWidth = isCollapsed ? "lg:w-20" : "lg:w-[280px]";
  const contentOffset = isCollapsed ? "lg:ml-20" : "lg:ml-[280px]";
  const ToggleIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;
  const userLabel = user?.name?.trim() || user?.email || "Minto";
  const collapsedItemClasses = isCollapsed
    ? "lg:h-11 lg:w-full lg:justify-center lg:px-0 lg:py-0"
    : "";

  return (
    <main className="min-h-screen w-full bg-background text-ink">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <aside
          className={`border-b border-border bg-surface transition-[width] duration-200 ease-out lg:fixed lg:inset-y-0 lg:left-0 lg:border-b-0 lg:border-r ${sidebarWidth}`}
        >
          <div className="flex h-full flex-col p-4 lg:px-4 lg:py-5">
            <div
              className={`flex items-center justify-between gap-2 ${
                isCollapsed ? "lg:flex-col lg:items-stretch lg:gap-2" : ""
              }`}
            >
              <Link
                href="/"
                className={`flex min-w-0 items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-card ${
                  isCollapsed ? "lg:justify-center" : ""
                } ${collapsedItemClasses}`}
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
                aria-label={isCollapsed ? "Expandir navegación" : "Colapsar navegación"}
                onClick={() => setIsCollapsed((current) => !current)}
                className={`hidden shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-secondary transition hover:bg-card hover:text-ink lg:flex ${
                  isCollapsed ? "lg:h-11 lg:w-full lg:justify-center lg:px-0 lg:py-0" : ""
                }`}
                title={isCollapsed ? "Expandir navegación" : "Colapsar navegación"}
              >
                <ToggleIcon aria-hidden="true" size={18} strokeWidth={1.8} />
                <span className={isCollapsed ? "lg:hidden" : "sr-only"}>
                  {isCollapsed ? "Expandir navegación" : "Colapsar navegación"}
                </span>
              </button>
            </div>

            <nav className="mt-4 flex gap-1 overflow-x-auto lg:mt-7 lg:flex-col lg:overflow-visible">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition ${collapsedItemClasses} ${
                      isActive
                        ? "bg-card text-ink"
                        : "text-secondary hover:bg-card hover:text-ink"
                    }`}
                    title={item.label}
                  >
                    <Icon
                      aria-hidden="true"
                      className="shrink-0"
                      size={18}
                      strokeWidth={1.8}
                    />
                    <span className={isCollapsed ? "lg:hidden" : ""}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 lg:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-semibold text-white">
                  {getUserInitial(user)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{userLabel}</p>
                  {user?.email ? (
                    <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p>
                  ) : null}
                </div>
              </div>
              <form action={logoutAction} className="shrink-0">
                <button
                  type="submit"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-secondary transition hover:border-primary hover:text-ink"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut aria-hidden="true" size={18} strokeWidth={1.8} />
                </button>
              </form>
            </div>

            <div
              className={`mt-auto hidden lg:block ${
                isCollapsed ? "space-y-2" : "space-y-3"
              }`}
            >
              <div
                className={`rounded-xl border border-border bg-card ${
                  isCollapsed ? "lg:border-transparent lg:bg-transparent lg:p-0" : "p-3"
                }`}
                title={user?.email}
              >
                <div
                  className={`flex items-center gap-3 rounded-xl ${
                    isCollapsed ? "lg:h-11 lg:w-full lg:justify-center lg:p-0" : ""
                  }`}
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-semibold text-white">
                    {getUserInitial(user)}
                  </div>
                  <div className={`min-w-0 ${isCollapsed ? "lg:hidden" : ""}`}>
                    <p className="truncate text-sm font-medium text-ink">{userLabel}</p>
                    {user?.email ? (
                      <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary transition hover:bg-card hover:text-ink ${
                    isCollapsed ? "lg:h-11 lg:justify-center lg:px-0 lg:py-0" : "border border-border bg-card"
                  }`}
                  title="Cerrar sesión"
                >
                  <LogOut aria-hidden="true" size={18} strokeWidth={1.8} />
                  <span className={isCollapsed ? "lg:hidden" : ""}>Cerrar sesión</span>
                </button>
              </form>
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
