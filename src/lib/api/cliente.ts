import { apiFetch } from "@/lib/api/client";
import type { ClienteResponseDTO, ClienteUpdateDTO } from "@/lib/types/dto";

export function getClienteMe() {
  return apiFetch<ClienteResponseDTO>("/clientes/me");
}

export function updateClienteMe(dto: ClienteUpdateDTO) {
  return apiFetch<ClienteResponseDTO>("/clientes/me", {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export function listClientes() {
  return apiFetch<ClienteResponseDTO[]>("/clientes");
}

export function getCliente(id: string) {
  return apiFetch<ClienteResponseDTO>(`/clientes/${id}`);
}
