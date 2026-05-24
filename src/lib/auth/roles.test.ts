import { describe, expect, it } from "vitest";
import { hasRole, normalizeRole, roleLabel } from "./roles";

describe("normalizeRole", () => {
  it("strips ROLE_ prefix", () => {
    expect(normalizeRole("ROLE_ADMIN")).toBe("ADMIN");
  });

  it("returns null for unknown role", () => {
    expect(normalizeRole("GUEST")).toBeNull();
  });
});

describe("hasRole", () => {
  it("checks membership", () => {
    expect(hasRole("CLIENTE", ["CLIENTE", "ADMIN"])).toBe(true);
    expect(hasRole("BARBEIRO", ["ADMIN"])).toBe(false);
    expect(hasRole(null, ["ADMIN"])).toBe(false);
  });
});

describe("roleLabel", () => {
  it("returns Portuguese label", () => {
    expect(roleLabel("BARBEIRO")).toBe("Barbeiro");
  });
});
