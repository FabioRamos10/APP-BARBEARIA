import { describe, expect, it } from "vitest";
import {
  decodeJwtPayload,
  getRoleFromToken,
  getSubjectFromToken,
  isTokenExpired,
} from "./session";

const MOCK_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0ZUBiYXJiZWFyaWEuY29tIiwicm9sZSI6IkNMSUVOVEUiLCJleHAiOjIwMDAwMDAwMDB9.mock";

describe("decodeJwtPayload", () => {
  it("decodes payload from mock token", () => {
    const payload = decodeJwtPayload(MOCK_TOKEN);
    expect(payload?.sub).toBe("teste@barbearia.com");
  });

  it("returns null for invalid token", () => {
    expect(decodeJwtPayload("invalid")).toBeNull();
  });
});

describe("session helpers", () => {
  it("extracts subject", () => {
    expect(getSubjectFromToken(MOCK_TOKEN)).toBe("teste@barbearia.com");
    expect(getRoleFromToken()).toBeNull();
  });

  it("detects non-expired token", () => {
    expect(isTokenExpired(MOCK_TOKEN)).toBe(false);
  });
});
