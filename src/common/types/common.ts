export type ApiSuccess<T> = {
  success: boolean;
  data: T;
  meta?: unknown;
};

export type ApiError = {
  message: string;
  code: string;
  details?: unknown;
};

export type ApiFailure = {
  success: boolean;
  error: ApiError;
};

export type ApiMeta = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};
