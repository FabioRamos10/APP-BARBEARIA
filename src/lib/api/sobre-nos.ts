import { apiFetch, apiFetchMultipart } from "@/lib/api/client";
import type {
  PublicacaoCreateDTO,
  PublicacaoResponseDTO,
} from "@/lib/types/dto";
import type { TipoPublicacao } from "@/lib/types/enums";

function buildPublicacaoForm(
  dto: PublicacaoCreateDTO,
  capa?: File | null,
  anexos?: File[],
): FormData {
  const form = new FormData();
  form.append(
    "dados",
    new Blob([JSON.stringify(dto)], { type: "application/json" }),
  );
  if (capa) form.append("capa", capa);
  for (const file of anexos ?? []) {
    form.append("anexos", file);
  }
  return form;
}

export function listPublicacoes() {
  return apiFetch<PublicacaoResponseDTO[]>("/sobre-nos/publicacoes", {
    skipAuth: true,
  });
}

export function listPublicacoesPorTipo(tipo: TipoPublicacao) {
  return apiFetch<PublicacaoResponseDTO[]>(
    `/sobre-nos/publicacoes/tipo/${tipo}`,
    { skipAuth: true },
  );
}

export function listPublicacoesAdmin() {
  return apiFetch<PublicacaoResponseDTO[]>("/sobre-nos/admin/publicacoes");
}

export function createPublicacao(dto: PublicacaoCreateDTO) {
  return apiFetch<PublicacaoResponseDTO>("/sobre-nos/admin/publicacoes", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function createPublicacaoComMidias(
  dto: PublicacaoCreateDTO,
  capa?: File | null,
  anexos?: File[],
) {
  return apiFetchMultipart<PublicacaoResponseDTO>(
    "/sobre-nos/admin/publicacoes/com-midias",
    buildPublicacaoForm(dto, capa, anexos),
    { method: "POST" },
  );
}

export function updatePublicacao(id: string, dto: PublicacaoCreateDTO) {
  return apiFetch<PublicacaoResponseDTO>(
    `/sobre-nos/admin/publicacoes/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(dto),
    },
  );
}

export function updatePublicacaoComMidias(
  id: string,
  dto: PublicacaoCreateDTO,
  capa?: File | null,
  anexos?: File[],
) {
  return apiFetchMultipart<PublicacaoResponseDTO>(
    `/sobre-nos/admin/publicacoes/${id}/com-midias`,
    buildPublicacaoForm(dto, capa, anexos),
    { method: "PUT" },
  );
}

export function deletePublicacao(id: string) {
  return apiFetch<void>(`/sobre-nos/admin/publicacoes/${id}`, {
    method: "DELETE",
  });
}
