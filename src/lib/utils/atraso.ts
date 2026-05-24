import type { StatusAtraso } from "@/lib/types/enums";

export function labelStatusAtraso(
  status: StatusAtraso,
  minutos?: number | null,
): string {
  switch (status) {
    case "INFORMADO":
      return "Informado";
    case "CONFIRMADO": {
      const m = minutos ?? 0;
      return m > 0
        ? `Confirmado (+${m} min aplicados)`
        : "Confirmado";
    }
    case "RECUSADO":
      return "Recusado";
    default:
      return status;
  }
}

export function mensagemConfirmacaoAtraso(minutos: number): string {
  return `Atraso confirmado. Horários ajustados em +${minutos} min.`;
}
