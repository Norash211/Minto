import type { Session } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { generateSessionToken, hashSessionToken } from "./session-token";

const sessionDurationMs = 30 * 24 * 60 * 60 * 1000;

export async function createUserSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const refreshTokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + sessionDurationMs);

  await prisma.session.create({
    data: {
      userId,
      refreshTokenHash,
      expiresAt,
    },
  });

  return token;
}

export async function getSessionFromToken(token: string): Promise<Session | null> {
  const refreshTokenHash = hashSessionToken(token);

  return prisma.session.findFirst({
    where: {
      refreshTokenHash,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
}

export async function revokeSessionToken(token: string): Promise<void> {
  const refreshTokenHash = hashSessionToken(token);

  await prisma.session.updateMany({
    where: {
      refreshTokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}
