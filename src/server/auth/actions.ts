"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { clearSessionCookie, getSessionCookie, setSessionCookie } from "./cookies";
import { hashPassword, verifyPassword } from "./password";
import { createUserSession, revokeSessionToken } from "./session";
import { loginSchema, registerSchema } from "./schemas";

export type AuthActionState = {
  error?: string;
};

const invalidCredentialsError = "Email o contraseña inválidos.";
const registerError = "No pudimos crear la cuenta. Revisa los datos e inténtalo de nuevo.";
const inviteCodeError = "No pudimos completar el registro.";
const validationError = "Revisa los datos e inténtalo de nuevo.";

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    inviteCode: formData.get("inviteCode"),
  });

  if (!parsed.success) {
    return { error: validationError };
  }

  const { name, email, password, inviteCode } = parsed.data;
  const registrationInviteCode = process.env.REGISTRATION_INVITE_CODE;

  if (!registrationInviteCode || inviteCode !== registrationInviteCode) {
    return { error: inviteCodeError };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return { error: registerError };
  }

  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        credentials: {
          create: {
            passwordHash,
            passwordUpdatedAt: new Date(),
          },
        },
      },
      select: {
        id: true,
      },
    });

    const token = await createUserSession(user.id);
    await setSessionCookie(token);
  } catch {
    return { error: registerError };
  }

  redirect("/");
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: invalidCredentialsError };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      credentials: true,
    },
  });

  if (!user?.credentials || user.status !== "ACTIVE") {
    return { error: invalidCredentialsError };
  }

  const isValidPassword = await verifyPassword(password, user.credentials.passwordHash);

  if (!isValidPassword) {
    return { error: invalidCredentialsError };
  }

  const token = await createUserSession(user.id);
  await setSessionCookie(token);

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  const token = await getSessionCookie();

  if (token) {
    await revokeSessionToken(token);
  }

  await clearSessionCookie();
  redirect("/login");
}
