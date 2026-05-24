import { apiFetch } from "@/lib/api/client";
import type {
  AvaliacaoCreateDTO,
  AvaliacaoResponseDTO,
  AvaliacoesBarbeiroDTO,
} from "@/lib/types/dto";

export function createAvaliacao(dto: AvaliacaoCreateDTO) {
  return apiFetch<AvaliacaoResponseDTO>("/avaliacoes", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function getAvaliacaoByAgendamento(agendamentoId: string) {
  return apiFetch<AvaliacaoResponseDTO>(
    `/avaliacoes/agendamento/${agendamentoId}`,
  );
}

export function getAvaliacoesByBarbeiro(barbeiroId: string) {
  return apiFetch<AvaliacoesBarbeiroDTO>(`/avaliacoes/barbeiro/${barbeiroId}`);
}
