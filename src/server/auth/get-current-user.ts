import type { User } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { getSessionCookie } from "./cookies";
import { getSessionFromToken } from "./session";

export async function getCurrentUser(): Promise<User | null> {
  const label = `[perf] getCurrentUser ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  console.time(label);

  const cookieLabel = `${label} getSessionCookie`;
  console.time(cookieLabel);
  const token = await getSessionCookie();
  console.timeEnd(cookieLabel);

  if (!token) {
    console.timeEnd(label);
    return null;
  }

  const sessionLabel = `${label} getSessionFromToken`;
  console.time(sessionLabel);
  const session = await getSessionFromToken(token);
  console.timeEnd(sessionLabel);

  if (!session) {
    console.timeEnd(label);
    return null;
  }

  const userLabel = `${label} prisma.user.findFirst`;
  console.time(userLabel);
  const user = await prisma.user.findFirst({
    where: {
      id: session.userId,
      status: "ACTIVE",
    },
  });
  console.timeEnd(userLabel);

  console.timeEnd(label);
  return user;
}
