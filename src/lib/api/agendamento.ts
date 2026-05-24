import { apiFetch } from "@/lib/api/client";
import type { StatusAgendamento } from "@/lib/types/enums";
import type {
  AgendaDisponivelResponseDTO,
  AgendamentoAtrasoDTO,
  AgendamentoCreateDTO,
  AgendamentoResponseDTO,
  AtrasoMensagemCreateDTO,
  AtrasoMensagemResponseDTO,
} from "@/lib/types/dto";

export interface DisponibilidadeParams {
  barbeiroId: string;
  data: string;
  servicoId?: string;
  servicoIds?: string[];
}

export function getDisponibilidade(params: DisponibilidadeParams) {
  const search = new URLSearchParams();
  search.set("barbeiroId", params.barbeiroId);
  search.set("data", params.data);
  if (params.servicoId) {
    search.set("servicoId", params.servicoId);
  }
  if (params.servicoIds?.length) {
    for (const id of params.servicoIds) {
      search.append("servicoIds", id);
    }
  }
  return apiFetch<AgendaDisponivelResponseDTO>(
    `/agendamentos/disponibilidade?${search.toString()}`,
  );
}

export function createAgendamento(dto: AgendamentoCreateDTO) {
  return apiFetch<AgendamentoResponseDTO>("/agendamentos", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function listAgendamentos() {
  return apiFetch<AgendamentoResponseDTO[]>("/agendamentos");
}

export function listAgendamentosByCliente(clienteId: string) {
  return apiFetch<AgendamentoResponseDTO[]>(
    `/agendamentos/cliente/${clienteId}`,
  );
}

export function listAgendamentosByBarbeiro(barbeiroId: string) {
  return apiFetch<AgendamentoResponseDTO[]>(
    `/agendamentos/barbeiro/${barbeiroId}`,
  );
}

export function getAgendamento(id: string) {
  return apiFetch<AgendamentoResponseDTO>(`/agendamentos/${id}`);
}

export function updateAgendamentoStatus(
  id: string,
  status: StatusAgendamento,
) {
  return apiFetch<AgendamentoResponseDTO>(
    `/agendamentos/${id}/status?status=${status}`,
    { method: "PATCH" },
  );
}

export function cancelAgendamento(id: string) {
  return apiFetch<void>(`/agendamentos/${id}`, { method: "DELETE" });
}

export function informarAtraso(id: string, dto: AgendamentoAtrasoDTO) {
  return apiFetch<AgendamentoResponseDTO>(`/agendamentos/${id}/atraso`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function confirmarAtraso(id: string) {
  return apiFetch<AgendamentoResponseDTO>(
    `/agendamentos/${id}/atraso/confirmar`,
    { method: "POST" },
  );
}

export function listAtrasoMensagens(agendamentoId: string) {
  return apiFetch<AtrasoMensagemResponseDTO[]>(
    `/agendamentos/${agendamentoId}/atraso/mensagens`,
  );
}

export function sendAtrasoMensagem(
  agendamentoId: string,
  dto: AtrasoMensagemCreateDTO,
) {
  return apiFetch<AtrasoMensagemResponseDTO>(
    `/agendamentos/${agendamentoId}/atraso/mensagens`,
    {
      method: "POST",
      body: JSON.stringify(dto),
    },
  );
}
