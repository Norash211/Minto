import { createHash, randomBytes } from "crypto";

const sessionTokenBytes = 32;

export function generateSessionToken(): string {
  return randomBytes(sessionTokenBytes).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
