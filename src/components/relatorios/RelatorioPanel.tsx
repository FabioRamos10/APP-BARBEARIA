"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  downloadRelatorioCompletoPdf,
  getRelatorioCompleto,
  getRelatorioFaturamento,
  getRelatorioPorBarbeiro,
  getRelatorioResumo,
} from "@/lib/api/relatorio";
import { formatAuthError } from "@/contexts/AuthContext";
import type {
  RelatorioCompletoDTO,
  RelatorioFaturamentoDTO,
  RelatorioPorBarbeiroDTO,
  RelatorioResumoDTO,
} from "@/lib/types/dto";
import {
  downloadBlob,
  formatAnoMes,
  STATUS_FOLHA_LABELS,
} from "@/lib/utils/comissao";
import { STATUS_LABELS } from "@/lib/utils/agendamento-status";
import { formatCurrency } from "@/lib/utils/format";
import { defaultReportRange } from "@/lib/utils/datetime";

export function RelatorioPanel() {
  const range = defaultReportRange();
  const [inicio, setInicio] = useState(range.inicio);
  const [fim, setFim] = useState(range.fim);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumo, setResumo] = useState<RelatorioResumoDTO | null>(null);
  const [porBarbeiro, setPorBarbeiro] = useState<RelatorioPorBarbeiroDTO | null>(
    null,
  );
  const [faturamento, setFaturamento] =
    useState<RelatorioFaturamentoDTO | null>(null);
  const [completo, setCompleto] = useState<RelatorioCompletoDTO | null>(null);

  const gerar = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r, pb, fat, comp] = await Promise.all([
        getRelatorioResumo(inicio, fim),
        getRelatorioPorBarbeiro(inicio, fim),
        getRelatorioFaturamento(inicio, fim),
        getRelatorioCompleto(inicio, fim),
      ]);
      setResumo(r);
      setPorBarbeiro(pb);
      setFaturamento(fat);
      setCompleto(comp);
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  const exportarPdf = async () => {
    setError(null);
    try {
      const blob = await downloadRelatorioCompletoPdf(inicio, fim);
      downloadBlob(blob, `relatorio-${inicio}-${fim}.pdf`);
    } catch (e) {
      setError(formatAuthError(e));
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard title="Período">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Início"
            name="inicio"
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
          />
          <Input
            label="Fim"
            name="fim"
            type="date"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={gerar} disabled={loading}>
            {loading ? "Gerando…" : "Gerar relatórios"}
          </Button>
          <Button variant="ghost" onClick={exportarPdf} disabled={loading}>
            Exportar PDF completo
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </GlassCard>

      {completo && (
        <GlassCard title="Visão completa">
          <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-text-muted">Cortes concluídos</dt>
              <dd className="text-lg text-neon-primary">{completo.cortesConcluidos}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Cancelados</dt>
              <dd>{completo.cancelados}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Faltas</dt>
              <dd>{completo.faltas}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Atrasos informados</dt>
              <dd>{completo.atrasosInformados}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Faturamento</dt>
              <dd className="text-neon-primary">
                {formatCurrency(Number(completo.faturamentoConcluidos))}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Pagamentos</dt>
              <dd>
                {completo.pagamentosPagos} pagos · {completo.pagamentosPendentes}{" "}
                pendentes
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Comissões (total)</dt>
              <dd className="text-neon-primary">
                {formatCurrency(Number(completo.totalComissoesPeriodo))}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">A pagar</dt>
              <dd>{formatCurrency(Number(completo.comissaoAPagar))}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Em andamento</dt>
              <dd>{formatCurrency(Number(completo.comissaoEmAndamento))}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Pagas</dt>
              <dd>{formatCurrency(Number(completo.comissaoPago))}</dd>
            </div>
          </dl>
          {(completo.folhasComissao?.length ?? 0) > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-text-muted">
                Folhas de comissão (meses do período)
              </p>
              <ul className="space-y-2 text-sm">
                {(completo.folhasComissao ?? []).map((f) => (
                  <li
                    key={f.folhaId}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-neon-primary/10 py-2"
                  >
                    <span>
                      {f.barbeiroNome} · {formatAnoMes(f.anoMes)}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="rounded-full border border-neon-primary/20 px-2 py-0.5 text-xs text-text-muted">
                        {STATUS_FOLHA_LABELS[f.status]}
                      </span>
                      <span className="text-neon-primary">
                        {formatCurrency(Number(f.valorTotal))}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(completo.porServico?.length ?? 0) > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-text-muted">
                Por serviço
              </p>
              <ul className="space-y-1 text-sm">
                {(completo.porServico ?? []).map((s) => (
                  <li key={s.servicoId} className="flex justify-between">
                    <span>{s.servicoNome}</span>
                    <span className="text-neon-primary">{s.quantidade}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GlassCard>
      )}

      {resumo && (
        <GlassCard title="Resumo">
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-text-muted">Total</dt>
              <dd className="text-lg text-neon-primary">
                {resumo.totalAgendamentos}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Conclusão</dt>
              <dd>{Number(resumo.taxaConclusaoPercent).toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="text-text-muted">Cancelamento</dt>
              <dd>{Number(resumo.taxaCancelamentoPercent).toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="text-text-muted">Faltas</dt>
              <dd>{Number(resumo.taxaFaltaPercent).toFixed(1)}%</dd>
            </div>
          </dl>
          <ul className="mt-4 space-y-1 text-sm text-text-muted">
            {(resumo.porStatus ?? []).map((item) => (
              <li key={item.status}>
                {STATUS_LABELS[item.status]}: {item.quantidade}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {faturamento && (
        <GlassCard title="Faturamento">
          <p className="text-2xl font-display text-neon-primary">
            {formatCurrency(Number(faturamento.faturamentoServicosConcluidos))}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Serviços concluídos no período
          </p>
        </GlassCard>
      )}

      {porBarbeiro && (porBarbeiro.itens?.length ?? 0) > 0 && (
        <GlassCard title="Por barbeiro">
          <ul className="space-y-2 text-sm">
            {(porBarbeiro.itens ?? []).map((item) => (
              <li
                key={item.barbeiroId}
                className="flex justify-between border-b border-neon-primary/10 py-2"
              >
                <span>{item.nomeBarbeiro}</span>
                <span className="text-neon-primary">
                  {item.quantidadeAgendamentos}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {completo && (completo.porBarbeiro?.length ?? 0) > 0 && (
        <GlassCard title="Detalhe por barbeiro">
          <ul className="space-y-3 text-sm">
            {(completo.porBarbeiro ?? []).map((b) => (
              <li key={b.barbeiroId} className="border-b border-neon-primary/10 pb-2">
                <p className="font-medium">{b.barbeiroNome}</p>
                <p className="text-text-muted">
                  Total {b.total} · Concluídos {b.concluidos} · Cancelados{" "}
                  {b.cancelados} · Faltas {b.faltas}
                </p>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
