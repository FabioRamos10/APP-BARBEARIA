import { describe, expect, it } from "vitest";
import {
  barberStatusActions,
  canCancel,
  filterAgendamentosByAba,
  matchesAgendaAba,
} from "./agendamento-status";

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

describe("agenda abas", () => {
  const items = [
    { status: "AGENDADO" as const, inicio: "2026-06-01T10:00:00" },
    { status: "CONFIRMADO" as const, inicio: "2026-06-02T10:00:00" },
    { status: "CONCLUIDO" as const, inicio: "2026-05-01T10:00:00" },
    { status: "CANCELADO" as const, inicio: "2026-04-01T10:00:00" },
    { status: "FALTOU" as const, inicio: "2026-03-01T10:00:00" },
  ];

  it("agrupa proximos", () => {
    expect(filterAgendamentosByAba(items, "PROXIMOS")).toHaveLength(2);
  });

  it("filtra concluidos", () => {
    expect(filterAgendamentosByAba(items, "CONCLUIDOS")).toHaveLength(1);
  });

  it("matches aba", () => {
    expect(matchesAgendaAba("FALTOU", "FALTAS")).toBe(true);
    expect(matchesAgendaAba("AGENDADO", "CONCLUIDOS")).toBe(false);
  });
});
