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
const isProduction = process.env.NODE_ENV === "production";

function getDevError(devError: string, productionError: string) {
  return isProduction ? productionError : devError;
}

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
    return {
      error: getDevError(parsed.error.issues[0]?.message ?? validationError, validationError),
    };
  }

  const { name, email, password, inviteCode } = parsed.data;
  const registrationInviteCode = process.env.REGISTRATION_INVITE_CODE;

  if (!registrationInviteCode || inviteCode !== registrationInviteCode) {
    return {
      error: getDevError("Código de invitación inválido.", inviteCodeError),
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      error: getDevError("Este correo ya está registrado.", registerError),
    };
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
  } catch (error) {
    console.error("Error creating user account", error);
    return {
      error: getDevError("Error interno al crear la cuenta.", registerError),
    };
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

  if (!user?.credentials) {
    return {
      error: getDevError("Usuario no encontrado o sin credenciales.", invalidCredentialsError),
    };
  }

  if (user.status !== "ACTIVE") {
    return {
      error: getDevError("Usuario no activo.", invalidCredentialsError),
    };
  }

  const isValidPassword = await verifyPassword(password, user.credentials.passwordHash);

  if (!isValidPassword) {
    return {
      error: getDevError("Contraseña incorrecta.", invalidCredentialsError),
    };
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
