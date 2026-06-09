import { getCurrentUser } from "@/server/auth";
import { AppShellClient } from "./app-shell-client";

type AppShellProps = {
  children: React.ReactNode;
};

export async function AppShell({ children }: AppShellProps) {
  const user = await getCurrentUser();

  return (
    <AppShellClient
      user={user ? { name: user.name, email: user.email } : null}
    >
      {children}
    </AppShellClient>
  );
}
