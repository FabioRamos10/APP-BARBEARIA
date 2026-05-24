import { describe, expect, it } from "vitest";
import { barberStatusActions, canCancel } from "./agendamento-status";

describe("canCancel", () => {
  it("allows cancel for active statuses", () => {
    expect(canCancel("AGENDADO")).toBe(true);
    expect(canCancel("CONCLUIDO")).toBe(false);
    expect(canCancel("CANCELADO")).toBe(false);
  });
});

describe("barberStatusActions", () => {
  it("suggests confirm from agendado", () => {
    const actions = barberStatusActions("AGENDADO");
    expect(actions.some((a) => a.status === "CONFIRMADO")).toBe(true);
  });
});
