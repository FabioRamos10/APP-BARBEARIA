import { apiFetch, apiFetchBlob } from "@/lib/api/client";
import type {
  FolhaComissaoResponseDTO,
  FolhaComissaoStatusDTO,
} from "@/lib/types/dto";

function qs(params: Record<string, string | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

export function listFolhasComissao(params?: {
  anoMes?: string;
  barbeiroId?: string;
}) {
  return apiFetch<FolhaComissaoResponseDTO[]>(
    `/comissoes/folhas${qs({
      anoMes: params?.anoMes,
      barbeiroId: params?.barbeiroId,
    })}`,
  );
}

export function listMesesComissao() {
  return apiFetch<string[]>("/comissoes/meses");
}

export function updateFolhaComissaoStatus(
  folhaId: string,
  dto: FolhaComissaoStatusDTO,
) {
  return apiFetch<FolhaComissaoResponseDTO>(
    `/comissoes/folhas/${folhaId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(dto),
    },
  );
}

export function downloadComissoesPdf(params?: {
  anoMes?: string;
  barbeiroId?: string;
  todos?: boolean;
}) {
  return apiFetchBlob(
    `/comissoes/export/pdf${qs({
      anoMes: params?.anoMes,
      barbeiroId: params?.barbeiroId,
      todos: params?.todos ? true : undefined,
    })}`,
  );
}
