import { TransactionsView } from "@/features/transactions";
import { requireCurrentUser } from "@/server/auth";

export default async function TransactionsPage() {
  await requireCurrentUser();

  return <TransactionsView />;
}
