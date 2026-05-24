import { apiFetch } from "@/lib/api/client";
import type {
  ServicoCreateDTO,
  ServicoResponseDTO,
  ServicoUpdateDTO,
} from "@/lib/types/dto";

export function listServicos(categoria?: string) {
  const query = categoria ? `?categoria=${encodeURIComponent(categoria)}` : "";
  return apiFetch<ServicoResponseDTO[]>(`/servicos${query}`);
}

export function getServico(id: string) {
  return apiFetch<ServicoResponseDTO>(`/servicos/${id}`);
}

export function createServico(dto: ServicoCreateDTO) {
  return apiFetch<ServicoResponseDTO>("/servicos", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function updateServico(id: string, dto: ServicoUpdateDTO) {
  return apiFetch<ServicoResponseDTO>(`/servicos/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}
