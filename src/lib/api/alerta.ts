import { apiFetch } from "@/lib/api/client";
import type { AlertaResponseDTO } from "@/lib/types/dto";

export function listAlertas() {
  return apiFetch<AlertaResponseDTO[]>("/alertas");
}

export function countAlertasNaoLidos() {
  return apiFetch<{ total: number }>("/alertas/nao-lidos/contagem");
}

export function marcarAlertaLido(id: string) {
  return apiFetch<void>(`/alertas/${id}/lido`, { method: "PATCH" });
}
