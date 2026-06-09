import { BucketsView } from "@/features/buckets";
import { requireCurrentUser } from "@/server/auth";
import { getBuckets } from "@/server/queries";

export default async function BucketsPage() {
  const user = await requireCurrentUser();
  const buckets = await getBuckets(user.id);

  return <BucketsView buckets={buckets} />;
}
