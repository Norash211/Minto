import { BucketsView } from "@/features/buckets";
import { requireCurrentUser } from "@/server/auth";

export default async function BucketsPage() {
  await requireCurrentUser();

  return <BucketsView />;
}
