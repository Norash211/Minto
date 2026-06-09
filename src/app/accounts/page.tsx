import { AccountsView } from "@/features/accounts";
import { requireCurrentUser } from "@/server/auth";

export default async function AccountsPage() {
  await requireCurrentUser();

  return <AccountsView />;
}
