import type { ApiErrorBody } from "@/lib/types/api";

export class ApiError extends Error {
  readonly status: number;
  readonly errorLabel?: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    errorLabel?: string,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorLabel = errorLabel;
    this.fieldErrors = fieldErrors;
  }
}

export function parseApiError(data: unknown, status: number): ApiError {
  if (data && typeof data === "object" && "message" in data) {
    const body = data as ApiErrorBody;
    return new ApiError(
      body.message ?? "Erro na requisição",
      body.status ?? status,
      body.error,
      body.errors,
    );
  }

  if (typeof data === "string" && data.trim()) {
    return new ApiError(data, status);
  }

  return new ApiError("Erro na requisição", status);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
