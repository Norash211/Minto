import { logoutAction } from "@/server/auth/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-secondary transition hover:border-primary hover:text-ink"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
