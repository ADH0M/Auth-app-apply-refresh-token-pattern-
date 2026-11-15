import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { verifyAccessToken } from "../utils/jwt";
import { UnauthorizedError } from "../error/auth-error";

const validateAuthorization = z
  .string()
  .regex(/^Bearer\s+\S+$/, "Invalid authorization header");

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      throw new UnauthorizedError("Authorization header is required");
    }

    const parsedHeader = validateAuthorization.safeParse(header);

    if (!parsedHeader.success) {
      throw new UnauthorizedError(
        "Invalid authorization header. Expected Bearer token",
      );
    }

    const token = parsedHeader.data.split(/\s+/)[1] as string;

    const verifiedToken = verifyAccessToken(token);

    req.user = {
      sub: verifiedToken.sub,
      email: verifiedToken.email,
      role: verifiedToken.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
