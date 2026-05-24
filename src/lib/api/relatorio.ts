import { apiFetch, apiFetchBlob } from "@/lib/api/client";
import type {
  RelatorioCompletoDTO,
  RelatorioFaturamentoDTO,
  RelatorioPorBarbeiroDTO,
  RelatorioResumoDTO,
} from "@/lib/types/dto";

function qs(inicio: string, fim: string) {
  return `?inicio=${inicio}&fim=${fim}`;
}

export function getRelatorioResumo(inicio: string, fim: string) {
  return apiFetch<RelatorioResumoDTO>(`/relatorios/resumo${qs(inicio, fim)}`);
}

export function getRelatorioPorBarbeiro(inicio: string, fim: string) {
  return apiFetch<RelatorioPorBarbeiroDTO>(
    `/relatorios/por-barbeiro${qs(inicio, fim)}`,
  );
}

export function getRelatorioFaturamento(inicio: string, fim: string) {
  return apiFetch<RelatorioFaturamentoDTO>(
    `/relatorios/faturamento${qs(inicio, fim)}`,
  );
}

function normalizeRelatorioCompleto(
  data: RelatorioCompletoDTO,
): RelatorioCompletoDTO {
  return {
    ...data,
    folhasComissao: data.folhasComissao ?? [],
    porServico: data.porServico ?? [],
    porBarbeiro: data.porBarbeiro ?? [],
    porStatus: data.porStatus ?? [],
    barbeiroPorStatus: data.barbeiroPorStatus ?? [],
    comissaoAPagar: data.comissaoAPagar ?? 0,
    comissaoEmAndamento: data.comissaoEmAndamento ?? 0,
    comissaoPago: data.comissaoPago ?? 0,
    totalComissoesPeriodo: data.totalComissoesPeriodo ?? 0,
  };
}

export async function getRelatorioCompleto(inicio: string, fim: string) {
  const data = await apiFetch<RelatorioCompletoDTO>(
    `/relatorios/completo${qs(inicio, fim)}`,
  );
  return normalizeRelatorioCompleto(data);
}

export function downloadRelatorioCompletoPdf(inicio: string, fim: string) {
  return apiFetchBlob(`/relatorios/completo/pdf${qs(inicio, fim)}`);
}
