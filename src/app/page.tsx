import { DashboardView } from "@/features/dashboard";
import { requireCurrentUser } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await requireCurrentUser();

  return <DashboardView />;
}
