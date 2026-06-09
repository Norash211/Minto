import { DebtsView } from "@/features/debts";
import { requireCurrentUser } from "@/server/auth";
import { getDebts } from "@/server/queries";

export default async function DebtsPage() {
  const user = await requireCurrentUser();
  const debts = await getDebts(user.id);

  return <DebtsView debts={debts} />;
}
