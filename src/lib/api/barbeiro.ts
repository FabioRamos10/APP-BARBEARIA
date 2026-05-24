import { apiFetch } from "@/lib/api/client";
import type { BarbeiroResponseDTO, BarbeiroUpdateDTO } from "@/lib/types/dto";

export function getBarbeiroMe() {
  return apiFetch<BarbeiroResponseDTO>("/barbeiros/me");
}

export function updateBarbeiroMe(dto: BarbeiroUpdateDTO) {
  return apiFetch<BarbeiroResponseDTO>("/barbeiros/me", {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export function listBarbeirosAtivos() {
  return apiFetch<BarbeiroResponseDTO[]>("/barbeiros/ativos");
}

export function listBarbeiros() {
  return apiFetch<BarbeiroResponseDTO[]>("/barbeiros");
}

export function updateBarbeiro(id: string, dto: BarbeiroUpdateDTO) {
  return apiFetch<BarbeiroResponseDTO>(`/barbeiros/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}
