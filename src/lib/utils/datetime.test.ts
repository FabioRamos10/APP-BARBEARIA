import { describe, expect, it } from "vitest";
import { toApiDateTime } from "./datetime";

describe("toApiDateTime", () => {
  it("appends seconds when missing", () => {
    expect(toApiDateTime("2026-05-17T10:00")).toBe("2026-05-17T10:00:00");
  });

  it("keeps value when seconds present", () => {
    expect(toApiDateTime("2026-05-17T10:00:00")).toBe("2026-05-17T10:00:00");
  });
});
