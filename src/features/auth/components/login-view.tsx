import Image from "next/image";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { formatMoney } from "@/lib/money";
import type { LoginPreviewMetric } from "../types";

const previewMetrics: LoginPreviewMetric[] = [
  {
    label: "Dinero total",
    value: 84750,
    description: "Todo tu dinero disponible hoy",
    accent: "bg-primary",
  },
  {
    label: "Dinero comprometido",
    value: 55949,
    description: "Apartado para compromisos",
    accent: "bg-debt",
  },
  {
    label: "Dinero libre",
    value: 28801,
    description: "Lo que realmente puedes usar",
    accent: "bg-income",
  },
];

export function LoginView() {
  return (
    <main className="min-h-screen w-full bg-background p-4 text-ink sm:p-6 lg:p-8">
      <div className="grid min-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border border-border bg-surface sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[55fr_45fr]">
        <section className="flex flex-col justify-between gap-10 p-6 sm:p-8 lg:p-10">
          <div className="space-y-14">
            <Link href="/" className="flex items-center gap-3" title="Minto">
              <Image
                src="/brand/minto-mark.png"
                alt="Minto"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl"
                priority
              />
              <span>
                <span className="block text-base font-semibold tracking-[0] text-ink">
                  Minto
                </span>
                <span className="block text-xs text-muted">Sistema financiero</span>
              </span>
            </Link>

            <div className="max-w-2xl">
              <p className="text-sm font-medium text-secondary">Acceso privado</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[0] text-ink sm:text-4xl">
                Bienvenido a Minto
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                Claridad financiera para saber cuánto dinero realmente puedes usar.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-secondary">Vista previa</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[0] text-ink">
                  Disponible real
                </h2>
              </div>
              <span className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">
                MXN
              </span>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {previewMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <div className={`mb-4 h-1 w-8 rounded-full ${metric.accent}`} />
                  <p className="text-sm font-medium text-secondary">{metric.label}</p>
                  <p className="mt-1 min-h-10 text-sm leading-5 text-muted">
                    {metric.description}
                  </p>
                  <p className="mt-4 text-xl font-semibold tracking-[0] text-ink">
                    {formatMoney(metric.value)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm font-medium text-ink">
                Dinero libre = dinero total - dinero comprometido
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Una lectura simple para decidir con calma.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center border-t border-border bg-background/40 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-[0] text-ink">
                Iniciar sesión
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Entra a tu espacio financiero personal.
              </p>
            </div>

            <form className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm text-secondary">Email</span>
                <span className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 transition focus-within:border-primary">
                  <Mail
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-muted"
                    strokeWidth={1.8}
                  />
                  <input
                    type="email"
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                    placeholder="tu@email.com"
                  />
                </span>
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-secondary">Contraseña</span>
                <span className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 transition focus-within:border-primary">
                  <Lock
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-muted"
                    strokeWidth={1.8}
                  />
                  <input
                    type="password"
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                    placeholder="••••••••"
                  />
                </span>
              </label>

              <div className="flex justify-end">
                <Link
                  href="/login"
                  className="text-sm font-medium text-secondary transition hover:text-ink"
                >
                  Olvidé mi contraseña
                </Link>
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Iniciar sesión
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-secondary transition hover:border-primary hover:text-ink"
              >
                <span
                  aria-hidden="true"
                  className="grid h-4 w-4 place-items-center text-xs font-semibold"
                >
                  G
                </span>
                Continuar con Google
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              ¿No tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-medium text-secondary transition hover:text-ink"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
