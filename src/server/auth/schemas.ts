import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email()
  .transform((email) => email.toLowerCase());

const passwordSchema = z.string().min(8);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: emailSchema,
  password: passwordSchema,
  inviteCode: z.string().trim().min(4),
});
