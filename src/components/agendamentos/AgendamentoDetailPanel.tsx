"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { StatusBadge } from "@/components/agendamentos/StatusBadge";
import { AtrasoPanel } from "@/components/atraso/AtrasoPanel";
import { PagamentoSection } from "@/components/pagamento/PagamentoSection";
import { getAgendamento } from "@/lib/api/agendamento";
import {
  createAvaliacao,
  getAvaliacaoByAgendamento,
} from "@/lib/api/avaliacao";
import { isApiError } from "@/lib/api/errors";
import { getPagamentoByAgendamento } from "@/lib/api/pagamento";
import { formatAuthError, useAuth } from "@/contexts/AuthContext";
import type {
  AgendamentoResponseDTO,
  AvaliacaoResponseDTO,
  PagamentoResponseDTO,
} from "@/lib/types/dto";
import { formatDateTime } from "@/lib/utils/format";

interface AgendamentoDetailPanelProps {
  agendamentoId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
}

async function loadOptional<T>(loader: () => Promise<T>): Promise<T | null> {
  try {
    return await loader();
  } catch (error) {
    if (isApiError(error) && (error.status === 404 || error.status === 403)) {
      return null;
    }
    console.warn("Falha ao carregar dado opcional do agendamento:", error);
    return null;
  }
}

export function AgendamentoDetailPanel({
  agendamentoId,
  onClose,
  onUpdated,
}: AgendamentoDetailPanelProps) {
  const { role } = useAuth();
  const isCliente = role === "CLIENTE";

  const [agendamento, setAgendamento] = useState<AgendamentoResponseDTO | null>(
    null,
  );
  const [pagamento, setPagamento] = useState<PagamentoResponseDTO | null>(null);
  const [avaliacao, setAvaliacao] = useState<AvaliacaoResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [nota, setNota] = useState("5");
  const [comentario, setComentario] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const reload = useCallback(async () => {
    if (!agendamentoId) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const ag = await getAgendamento(agendamentoId);
      setAgendamento(ag);
      const [pag, aval] = await Promise.all([
        loadOptional(() => getPagamentoByAgendamento(agendamentoId)),
        loadOptional(() => getAvaliacaoByAgendamento(agendamentoId)),
      ]);
      setPagamento(pag);
      setAvaliacao(aval);
      setError(null);
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setLoading(false);
    }
  }, [agendamentoId]);

  useEffect(() => {
    if (!agendamentoId) {
      const timer = window.setTimeout(() => {
        setAgendamento(null);
        setPagamento(null);
        setAvaliacao(null);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timer);
  }, [agendamentoId, reload]);

  useEffect(() => {
    if (!agendamentoId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [agendamentoId]);

  if (!agendamentoId || !mounted) {
    return null;
  }

  const canReview =
    isCliente &&
    agendamento?.status === "CONCLUIDO" &&
    !avaliacao;

  const handleAvaliar = async () => {
    if (!agendamento) return;
    setError(null);
    try {
      const created = await createAvaliacao({
        agendamentoId: agendamento.id,
        nota: Number(nota),
        comentario: comentario.trim() || undefined,
      });
      setAvaliacao(created);
      setMessage("Avaliação enviada. Obrigado!");
      onUpdated?.();
    } catch (e) {
      setError(formatAuthError(e));
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agendamento-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 z-0 cursor-default bg-bg-deep/95 backdrop-blur-md"
        aria-label="Fechar detalhes"
        onClick={onClose}
      />
      <div className="glass-panel relative z-10 isolate max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl shadow-[0_0_48px_rgba(0,0,0,0.65)]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-neon-primary/15 bg-bg-surface/95 px-6 py-4 backdrop-blur-md">
          <div>
            <h2
              id="agendamento-detail-title"
              className="font-display text-lg font-semibold"
            >
              Detalhes
            </h2>
            {agendamento && (
              <p className="mt-1 text-sm text-text-muted">
                {(agendamento.servicos?.length
                  ? agendamento.servicos.map((s) => s.nome).join(", ")
                  : agendamento.servico.nome) || "Serviços"}
              </p>
            )}
          </div>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
        {loading && (
          <p className="text-sm text-text-muted">Carregando…</p>
        )}

        {error && (
          <p className="mb-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-3 rounded-lg border border-neon-primary/30 bg-neon-primary/10 px-3 py-2 text-sm text-neon-primary">
            {message}
          </p>
        )}

        {agendamento && !loading && (
          <div className="space-y-5">
            <section className="space-y-2 rounded-xl border border-neon-primary/10 bg-bg-deep/40 p-4 text-sm">
              <div className="flex items-center gap-2">
                <StatusBadge status={agendamento.status} />
              </div>
              <p className="text-neon-primary">
                {formatDateTime(agendamento.inicio)} —{" "}
                {formatDateTime(agendamento.fim)}
              </p>
              <p className="text-text-muted">
                Cliente: {agendamento.cliente.nome}
              </p>
              <p className="text-text-muted">
                Barbeiro: {agendamento.barbeiro.nome}
              </p>
            </section>

            <section className="rounded-xl border border-neon-primary/10 bg-bg-deep/30 p-4">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                Atraso
              </h3>
              <AtrasoPanel
                agendamento={agendamento}
                onUpdated={(ag) => {
                  setAgendamento(ag);
                  onUpdated?.();
                }}
                onMessage={setMessage}
                onError={setError}
              />
            </section>

            <section className="rounded-xl border border-neon-primary/10 bg-bg-deep/30 p-4">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                Pagamento
              </h3>
              <PagamentoSection
                agendamento={agendamento}
                pagamento={pagamento}
                role={role}
                onUpdated={(p) => {
                  setPagamento(p);
                  onUpdated?.();
                }}
                onMessage={setMessage}
                onError={setError}
              />
            </section>

            <section className="rounded-xl border border-neon-primary/10 bg-bg-deep/30 p-4">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                Avaliação
              </h3>
              {avaliacao ? (
                <div className="text-sm">
                  <p className="text-neon-primary">
                    {"★".repeat(avaliacao.nota)}
                    {"☆".repeat(5 - avaliacao.nota)}
                  </p>
                  {avaliacao.comentario && (
                    <p className="mt-1 text-text-muted">{avaliacao.comentario}</p>
                  )}
                </div>
              ) : canReview ? (
                <div className="space-y-3">
                  <Select
                    label="Nota"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    options={[5, 4, 3, 2, 1].map((n) => ({
                      value: String(n),
                      label: `${n} estrela${n > 1 ? "s" : ""}`,
                    }))}
                    placeholder=""
                  />
                  <Textarea
                    label="Comentário (opcional)"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                  />
                  <Button onClick={handleAvaliar}>Enviar avaliação</Button>
                </div>
              ) : (
                <p className="text-sm text-text-muted">
                  {agendamento.status === "CONCLUIDO"
                    ? "Sem avaliação ainda."
                    : "Disponível após conclusão do atendimento."}
                </p>
              )}
            </section>
          </div>
        )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
