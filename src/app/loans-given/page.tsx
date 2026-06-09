import { LoansGivenView } from "@/features/loans-given";
import { requireCurrentUser } from "@/server/auth";

export default async function LoansGivenPage() {
  await requireCurrentUser();

  return <LoansGivenView />;
}
