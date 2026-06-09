import { prisma } from "@/server/db/prisma";

export async function getBuckets(userId: string) {
  return prisma.bucket.findMany({
    where: {
      userId,
    },
    orderBy: [{ priority: "asc" }, { name: "asc" }],
  });
}

export type GetBucketsResult = Awaited<ReturnType<typeof getBuckets>>;
