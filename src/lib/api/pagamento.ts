import { apiFetch, apiFetchBlob } from "@/lib/api/client";
import { getToken } from "@/lib/auth/token";
import { parseApiError } from "@/lib/api/errors";
import type {
  PagamentoCreateDTO,
  PagamentoResponseDTO,
} from "@/lib/types/dto";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api-backend";
}

export function createPagamento(dto: PagamentoCreateDTO) {
  return apiFetch<PagamentoResponseDTO>("/pagamentos", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function getPagamentoByAgendamento(agendamentoId: string) {
  return apiFetch<PagamentoResponseDTO>(
    `/pagamentos/agendamento/${agendamentoId}`,
  );
}

export function confirmarPagamento(id: string) {
  return apiFetch<PagamentoResponseDTO>(`/pagamentos/${id}/confirmar`, {
    method: "PATCH",
  });
}

export function enviarComprovante(pagamentoId: string, arquivo: File) {
  const form = new FormData();
  form.append("arquivo", arquivo);

  const headers = new Headers();
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${getBaseUrl()}/pagamentos/${pagamentoId}/comprovante`;

  return fetch(url, { method: "POST", body: form, headers }).then(
    async (response) => {
      const text = await response.text();
      let data: unknown = null;
      if (text) {
        try {
          data = JSON.parse(text) as unknown;
        } catch {
          data = { message: text };
        }
      }
      if (!response.ok) {
        throw parseApiError(data, response.status);
      }
      return (data ?? {}) as PagamentoResponseDTO;
    },
  );
}

export function baixarComprovanteBlob(pagamentoId: string) {
  return apiFetchBlob(`/pagamentos/${pagamentoId}/comprovante`);
}
