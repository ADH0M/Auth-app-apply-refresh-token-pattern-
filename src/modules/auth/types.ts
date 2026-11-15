import type { z } from "zod";
import type { User } from "../../generated/prisma/browser";
import { LoginSchema, RefreshTokenSchema, RegisterSchema } from "./dto";

export type UserRegister = z.infer<typeof RegisterSchema>;
export type UserLogin = z.infer<typeof LoginSchema>;
export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>;

export const USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  isActive: true,
  refreshToken: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export type SafeUser = Omit<User, "passwordHash">;

export type LoginResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};
