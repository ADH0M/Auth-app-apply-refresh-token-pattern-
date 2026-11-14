import { AppError } from "./app-error";

// 401 unauthorized
export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Unauthorized",
    details?: unknown,
  ) {
    super(401, "UNAUTHORIZED", message, details);
  }
}

// 403 forbidden
export class ForbiddenError extends AppError {
  constructor(
    message: string = "Forbidden",
    details?: unknown,
  ) {
    super(403, "FORBIDDEN", message, details);
  }
}
