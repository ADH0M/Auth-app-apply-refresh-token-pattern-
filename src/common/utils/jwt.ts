import jwt from "jsonwebtoken";
import type { TokenPayload } from "../types/common";
import { env } from "../../config/env";
import { UnauthorizedError } from "../error/auth-error";
import { z } from "zod";

const ACCESS_TOKEN_OPTIONS: jwt.SignOptions = {
  algorithm: "HS256",
  audience: env.JWT_AUDINCE,
  issuer: env.JWT_ISSUER,
  expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN as NonNullable<
    jwt.SignOptions["expiresIn"]
  >,
};

const REFRESH_TOKEN_OPTIONS: jwt.SignOptions = {
  algorithm: "HS256",
  audience: env.JWT_AUDINCE,
  issuer: env.JWT_ISSUER,
  expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN as NonNullable<
    jwt.SignOptions["expiresIn"]
  >,
};

export const signAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, ACCESS_TOKEN_OPTIONS);
};

export const signRefreshToken = (payload: Pick<TokenPayload, "email">) => {
  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, REFRESH_TOKEN_OPTIONS);
};

export const verifyAccessToken = (token: string) => {
  try {
    const secret = env.JWT_ACCESS_TOKEN_SECRET;
    const payload = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      audience: env.JWT_AUDINCE,
      issuer: env.JWT_ISSUER,
    }) as TokenPayload;

    const parsed = accessSchema.safeParse(payload);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }));
      throw new UnauthorizedError("Invalid access token payload", {
        fieldErrors: errors,
      });
    }
    return parsed.data;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Access token expired");
    }

    throw new UnauthorizedError("Invalid access token");
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const secret = env.JWT_REFRESH_TOKEN_SECRET;
    const payload = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      audience: env.JWT_AUDINCE,
      issuer: env.JWT_ISSUER,
    }) as Pick<TokenPayload, "email">;

    const parsed = refreshSchema.safeParse(payload);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }));
      throw new UnauthorizedError("Invalid Refresh token payload", {
        fieldErrors: errors,
      });
    }
    return parsed.data;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Refresh token expired.");
    }
    throw new UnauthorizedError("Invalid Refresh token.");
  }
};

const refreshSchema = z.object({
  email: z.string().min(3),
});

const accessSchema = z.object({
  sub: z.string(),
  email: z.string(),
  role: z.string(),
});
