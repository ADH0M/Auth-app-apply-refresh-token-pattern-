import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import type { ApiError } from "../types/common";
import { AppError } from "../error/app-error";
import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    const issuses = error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    respond(res, 422, {
      message: "Request Validation fialed",
      code: "UNPROCESSABLE",
      details: { fieldErrors: issuses },
    });
    return;
  }

  if (error instanceof AppError) {
    const { message, code, details } = error;
    respond(res, error.statusCode, {
      message,
      code,
      details,
    });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": // unique constraint — field names hidden
        respond(res, 409, {
          code: "CONFLICT",
          message: "A resource with the same unique value already exists.",
        });
        return;
      case "P2025": // record not found
        respond(res, 404, {
          code: "NOT_FOUND",
          message: "Resource not found.",
        });
        return;
      case "P2034": // transaction conflict / deadlock
        respond(res, 409, {
          code: "CONFLICT",
          message: "Concurrent modification detected, please retry.",
        });
        return;
      default:
        break; // fall through to generic 500
    }
  }

  console.error(`\n[unhandle-error]`);
  console.error(error);
  respond(res, 500, {
    message: "an unexpected error occurred ",
    code: "INTERNAL ERROR",
  });
  return;
};

function respond(res: Response, statusCode: number, error: ApiError) {
  if (res.headersSent) {
    console.error(
      `[error-handler] error already sent,drroping error`,
      error.code,
    );
    return;
  }

  const body = { sucess: false, error };
  if (body.error.details === undefined) delete body.error.details;
  res.status(statusCode).json(body);
};
