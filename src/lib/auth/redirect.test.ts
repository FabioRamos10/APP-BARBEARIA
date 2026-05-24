import { describe, expect, it } from "vitest";
import { getDashboardPath, isDashboardPath } from "./redirect";

describe("getDashboardPath", () => {
  it("maps each role to dashboard route", () => {
    expect(getDashboardPath("CLIENTE")).toBe("/dashboard/cliente");
    expect(getDashboardPath("ADMIN")).toBe("/dashboard/admin");
  });
});

describe("isDashboardPath", () => {
  it("detects dashboard routes", () => {
    expect(isDashboardPath("/dashboard")).toBe(true);
    expect(isDashboardPath("/dashboard/cliente")).toBe(true);
    expect(isDashboardPath("/login")).toBe(false);
  });
});
