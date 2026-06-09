import { LoansGivenView } from "@/features/loans-given";
import { requireCurrentUser } from "@/server/auth";
import { getLoansGiven } from "@/server/queries";

export default async function LoansGivenPage() {
  const user = await requireCurrentUser();
  const loansGiven = await getLoansGiven(user.id);

  return <LoansGivenView loansGiven={loansGiven} />;
}
