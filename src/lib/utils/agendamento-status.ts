import type { StatusAgendamento } from "@/lib/types/enums";

export const STATUS_LABELS: Record<StatusAgendamento, string> = {
  AGENDADO: "Agendado",
  CONFIRMADO: "Confirmado",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  FALTOU: "Faltou",
};

export const STATUS_STYLES: Record<StatusAgendamento, string> = {
  AGENDADO: "border-neon-primary/40 text-neon-primary bg-neon-primary/10",
  CONFIRMADO: "border-blue-400/40 text-blue-300 bg-blue-400/10",
  EM_ANDAMENTO: "border-warning/40 text-warning bg-warning/10",
  CONCLUIDO: "border-neon-bright/40 text-neon-bright bg-neon-bright/10",
  CANCELADO: "border-text-muted/40 text-text-muted bg-text-muted/10",
  FALTOU: "border-danger/40 text-danger bg-danger/10",
};

export function canCancel(status: StatusAgendamento): boolean {
  return status !== "CONCLUIDO" && status !== "CANCELADO";
}

export function barberStatusActions(
  current: StatusAgendamento,
): { label: string; status: StatusAgendamento }[] {
  switch (current) {
    case "AGENDADO":
      return [
        { label: "Confirmar", status: "CONFIRMADO" },
        { label: "Faltou", status: "FALTOU" },
      ];
    case "CONFIRMADO":
      return [
        { label: "Iniciar", status: "EM_ANDAMENTO" },
        { label: "Faltou", status: "FALTOU" },
      ];
    case "EM_ANDAMENTO":
      return [{ label: "Concluir", status: "CONCLUIDO" }];
    default:
      return [];
  }
}

export const STAFF_STATUS_OPTIONS: StatusAgendamento[] = [
  "AGENDADO",
  "CONFIRMADO",
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "CANCELADO",
  "FALTOU",
];

/** Abas da agenda — agrupadas para mobile */
export type AgendaAba = "PROXIMOS" | "CONCLUIDOS" | "CANCELADOS" | "FALTAS";

export const AGENDA_ABAS: {
  value: AgendaAba;
  label: string;
  descricao: string;
}[] = [
  {
    value: "PROXIMOS",
    label: "Próximos",
    descricao: "Agendado, confirmado e em andamento",
  },
  {
    value: "CONCLUIDOS",
    label: "Concluídos",
    descricao: "Atendimentos finalizados",
  },
  {
    value: "CANCELADOS",
    label: "Cancelados",
    descricao: "Agendamentos cancelados",
  },
  {
    value: "FALTAS",
    label: "Faltas",
    descricao: "Cliente não compareceu",
  },
];

const PROXIMOS: StatusAgendamento[] = [
  "AGENDADO",
  "CONFIRMADO",
  "EM_ANDAMENTO",
];

const ABAS_STATUS: Record<AgendaAba, StatusAgendamento[]> = {
  PROXIMOS,
  CONCLUIDOS: ["CONCLUIDO"],
  CANCELADOS: ["CANCELADO"],
  FALTAS: ["FALTOU"],
};

export function matchesAgendaAba(
  status: StatusAgendamento,
  aba: AgendaAba,
): boolean {
  return ABAS_STATUS[aba].includes(status);
}

export function filterAgendamentosByAba<T extends { status: StatusAgendamento }>(
  items: T[],
  aba: AgendaAba,
): T[] {
  return items.filter((ag) => matchesAgendaAba(ag.status, aba));
}

export function countAgendamentosByAba<T extends { status: StatusAgendamento }>(
  items: T[],
): Record<AgendaAba, number> {
  const counts = {} as Record<AgendaAba, number>;
  for (const opt of AGENDA_ABAS) {
    counts[opt.value] = filterAgendamentosByAba(items, opt.value).length;
  }
  return counts;
}

export function sortAgendamentosForAgenda<T extends { inicio: string }>(
  items: T[],
  aba: AgendaAba,
): T[] {
  const copy = [...items];
  const useDesc = aba !== "PROXIMOS";
  copy.sort((a, b) => {
    const ta = new Date(a.inicio).getTime();
    const tb = new Date(b.inicio).getTime();
    return useDesc ? tb - ta : ta - tb;
  });
  return copy;
}

export function servicosLabel(ag: {
  servico: { nome: string };
  servicos?: { nome: string }[];
}): string {
  if (ag.servicos?.length) {
    return ag.servicos.map((s) => s.nome).join(", ");
  }
  return ag.servico.nome;
}
