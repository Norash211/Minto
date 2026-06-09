import { TransactionsView } from "@/features/transactions";
import { requireCurrentUser } from "@/server/auth";
import { getRecentTransactions } from "@/server/queries";

export default async function TransactionsPage() {
  const user = await requireCurrentUser();
  const transactions = await getRecentTransactions(user.id);

  return <TransactionsView transactions={transactions} />;
}
