import { AppError } from "./app-error";

// 400 bad request
export class BadRequestError extends AppError {
  constructor(message: string = "Bad request.", details?: unknown) {
    super(400, "BAD_REQUEST", message, details);
  }
}

// 404 not found
export class NotFoundError extends AppError {
  constructor(message: string = "resource not found.", details?: unknown) {
    super(404, "NOT_FOUND", message, details);
  }
}

// 409 conflict
export class ConflictError extends AppError {
  constructor(
    message: string = "Request not match current state",
    details?: unknown,
  ) {
    super(409, "CONFLICT", message, details);
  }
}

// 422 unproccessable
export class UnprocessableEntityError extends AppError {
  constructor(message: string = "Unprocessable Entity", details?: unknown) {
    super(422, "UNPROCESSABLE", message, details);
  }
}
