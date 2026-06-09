import { DashboardView } from "@/features/dashboard";
import { requireCurrentUser } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requireCurrentUser();

  return <DashboardView user={user} />;
}
