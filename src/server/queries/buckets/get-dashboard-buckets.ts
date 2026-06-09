import { prisma } from "@/server/db/prisma";

export async function getDashboardBuckets(userId: string) {
  return prisma.bucket.findMany({
    where: {
      userId,
    },
    orderBy: [{ priority: "asc" }, { name: "asc" }],
    take: 4,
  });
}

export type GetDashboardBucketsResult = Awaited<ReturnType<typeof getDashboardBuckets>>;
