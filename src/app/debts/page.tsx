import { DebtsView } from "@/features/debts";
import { requireCurrentUser } from "@/server/auth";

export default async function DebtsPage() {
  await requireCurrentUser();

  return <DebtsView />;
}
