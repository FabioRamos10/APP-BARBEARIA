import type { StatusFolhaComissao } from "@/lib/types/enums";

export const STATUS_FOLHA_LABELS: Record<StatusFolhaComissao, string> = {
  A_PAGAR: "A pagar",
  EM_ANDAMENTO: "Em andamento",
  PAGO: "Pago",
};

export function currentAnoMes(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function formatAnoMes(anoMes: string): string {
  const [y, m] = anoMes.split("-");
  if (!y || !m) {
    return anoMes;
  }
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const idx = Number(m) - 1;
  return `${months[idx] ?? m} de ${y}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
