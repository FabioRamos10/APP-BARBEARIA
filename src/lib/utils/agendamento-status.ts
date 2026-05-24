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
