"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  downloadComissoesPdf,
  listFolhasComissao,
  listMesesComissao,
  updateFolhaComissaoStatus,
} from "@/lib/api/comissao";
import { formatAuthError, useAuth } from "@/contexts/AuthContext";
import type { FolhaComissaoResponseDTO } from "@/lib/types/dto";
import type { StatusFolhaComissao } from "@/lib/types/enums";
import { STATUS_FOLHA_COMISSAO } from "@/lib/types/enums";
import {
  currentAnoMes,
  downloadBlob,
  formatAnoMes,
  STATUS_FOLHA_LABELS,
} from "@/lib/utils/comissao";
import { formatCurrency } from "@/lib/utils/format";

interface ComissoesPanelProps {
  /** Barbeiro vê apenas as próprias folhas (API filtra por perfil). */
  readOnlyStatus?: boolean;
}

export function ComissoesPanel({ readOnlyStatus = false }: ComissoesPanelProps) {
  const { role } = useAuth();
  const isAdmin = role === "ADMIN";

  const [anoMes, setAnoMes] = useState(currentAnoMes());
  const [meses, setMeses] = useState<string[]>([]);
  const [folhas, setFolhas] = useState<FolhaComissaoResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMeses = useCallback(async () => {
    if (!isAdmin && role !== "RECEPCIONISTA") {
      return;
    }
    try {
      setMeses(await listMesesComissao());
    } catch {
      /* opcional */
    }
  }, [isAdmin, role]);

  const loadFolhas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setFolhas(await listFolhasComissao({ anoMes }));
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setLoading(false);
    }
  }, [anoMes]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMeses();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadMeses]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadFolhas(), 0);
    return () => window.clearTimeout(timer);
  }, [loadFolhas]);

  const handleStatusChange = async (
    folha: FolhaComissaoResponseDTO,
    status: StatusFolhaComissao,
  ) => {
    setUpdatingId(folha.id);
    setError(null);
    try {
      await updateFolhaComissaoStatus(folha.id, { status });
      await loadFolhas();
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setUpdatingId(null);
    }
  };

  const exportPdf = async (todos = false) => {
    setError(null);
    try {
      const blob = await downloadComissoesPdf(
        todos ? { todos: true } : { anoMes },
      );
      downloadBlob(
        blob,
        todos ? "comissoes-historico.pdf" : `comissoes-${anoMes}.pdf`,
      );
    } catch (e) {
      setError(formatAuthError(e));
    }
  };

  const mesOptions = [
    anoMes,
    ...meses.filter((m) => m !== anoMes),
  ].map((m) => ({ value: m, label: formatAnoMes(m) }));

  return (
    <div className="space-y-6">
      <GlassCard title="Filtros">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[12rem] flex-1">
            <Select
              label="Mês"
              value={anoMes}
              onChange={(e) => setAnoMes(e.target.value)}
              options={mesOptions.length > 0 ? mesOptions : [{ value: anoMes, label: formatAnoMes(anoMes) }]}
              placeholder=""
            />
          </div>
          <Input
            label="Ou digite (AAAA-MM)"
            value={anoMes}
            onChange={(e) => setAnoMes(e.target.value)}
            placeholder="2026-05"
            className="max-w-[10rem]"
          />
          <Button onClick={loadFolhas} disabled={loading}>
            {loading ? "Carregando…" : "Atualizar"}
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => void exportPdf(false)}>
            Exportar PDF do mês
          </Button>
          {(isAdmin || role === "RECEPCIONISTA") && (
            <Button variant="ghost" onClick={() => void exportPdf(true)}>
              Exportar PDF (histórico)
            </Button>
          )}
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </GlassCard>

      <GlassCard title={`Folhas — ${formatAnoMes(anoMes)}`}>
        {folhas.length === 0 && !loading && (
          <p className="text-sm text-text-muted">
            Nenhuma comissão registrada neste mês.
          </p>
        )}
        <ul className="space-y-3">
          {folhas.map((f) => (
            <li
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-neon-primary/10 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{f.barbeiroNome}</p>
                <p className="text-text-muted">
                  {f.quantidadeAtendimentos} atendimento
                  {f.quantidadeAtendimentos !== 1 ? "s" : ""} ·{" "}
                  {formatCurrency(Number(f.valorTotal))}
                </p>
              </div>
              {isAdmin && !readOnlyStatus ? (
                <Select
                  label=""
                  value={f.status}
                  disabled={updatingId === f.id}
                  onChange={(e) =>
                    void handleStatusChange(
                      f,
                      e.target.value as StatusFolhaComissao,
                    )
                  }
                  options={STATUS_FOLHA_COMISSAO.map((s) => ({
                    value: s,
                    label: STATUS_FOLHA_LABELS[s],
                  }))}
                  placeholder=""
                  className="min-w-[10rem]"
                />
              ) : (
                <span className="rounded-full border border-neon-primary/30 px-3 py-1 text-neon-primary">
                  {STATUS_FOLHA_LABELS[f.status]}
                </span>
              )}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
