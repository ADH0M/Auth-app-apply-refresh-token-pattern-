import type { NextFunction, Request, Response } from "express";

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(404).json({
    success: false,
    error: {
      message: `[Route] ${req.method} - ${req.originalUrl} not found`,
      code: "NOT_FOUND",
    },
  });
};
