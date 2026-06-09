import { notFound } from "next/navigation";
import { AccountDetailView } from "@/features/accounts";
import { requireCurrentUser } from "@/server/auth";
import { getAccountDetail } from "@/server/queries";

type AccountDetailPageProps = {
  params: Promise<{
    accountId: string;
  }>;
};

export default async function AccountDetailPage({ params }: AccountDetailPageProps) {
  const [{ accountId }, user] = await Promise.all([params, requireCurrentUser()]);
  const accountDetail = await getAccountDetail(user.id, accountId);

  if (!accountDetail) {
    notFound();
  }

  return <AccountDetailView accountDetail={accountDetail} />;
}
