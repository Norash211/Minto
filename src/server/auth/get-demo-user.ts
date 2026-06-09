import { prisma } from "@/server/db/prisma";

const demoEmail = "demo@minto.app";

export async function getDemoUser() {
  const user = await prisma.user.findUnique({
    where: {
      email: demoEmail,
    },
  });

  if (!user) {
    throw new Error(`Demo user not found: ${demoEmail}. Run npx prisma db seed first.`);
  }

  return user;
}
