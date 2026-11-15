import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string(),
  password: z.string().min(6),
  phone: z.string(),
});

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(10),
});

export const ChangePasswordSchema =z.object({
    currentPass:z.string().min(6),
    newPass :z.string().min(6),
})