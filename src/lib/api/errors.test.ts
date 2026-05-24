import { describe, expect, it } from "vitest";
import { ApiError, isApiError, parseApiError } from "./errors";

describe("parseApiError", () => {
  it("parses validation error body", () => {
    const err = parseApiError(
      {
        message: "Erro de validação",
        errors: { email: "inválido" },
        status: 400,
        error: "Bad Request",
      },
      400,
    );

    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe("Erro de validação");
    expect(err.status).toBe(400);
    expect(err.fieldErrors?.email).toBe("inválido");
  });

  it("falls back for unknown body", () => {
    const err = parseApiError(null, 500);
    expect(err.message).toBe("Erro na requisição");
    expect(err.status).toBe(500);
  });
});

describe("isApiError", () => {
  it("detects ApiError instances", () => {
    expect(isApiError(new ApiError("x", 401))).toBe(true);
    expect(isApiError(new Error("x"))).toBe(false);
  });
});
