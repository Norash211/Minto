import type { User } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { getSessionCookie } from "./cookies";
import { getSessionFromToken } from "./session";

export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionCookie();

  if (!token) {
    return null;
  }

  const session = await getSessionFromToken(token);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.userId,
      status: "ACTIVE",
    },
  });

  return user;
}
