import { AccountsView } from "@/features/accounts";
import { requireCurrentUser } from "@/server/auth";
import { getAccounts } from "@/server/queries";

export default async function AccountsPage() {
  const user = await requireCurrentUser();
  const accounts = await getAccounts(user.id);

  return <AccountsView accounts={accounts} />;
}
