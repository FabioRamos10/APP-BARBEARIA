"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  confirmarAtraso,
  informarAtraso,
  listAtrasoMensagens,
  recusarAtraso,
  sendAtrasoMensagem,
} from "@/lib/api/agendamento";
import { formatAuthError, useAuth } from "@/contexts/AuthContext";
import type {
  AgendamentoResponseDTO,
  AtrasoMensagemResponseDTO,
} from "@/lib/types/dto";
import type { Role } from "@/lib/types/enums";
import {
  labelStatusAtraso,
  mensagemConfirmacaoAtraso,
  mensagemRecusaAtraso,
} from "@/lib/utils/atraso";
import { formatDateTime } from "@/lib/utils/format";

interface AtrasoPanelProps {
  agendamento: AgendamentoResponseDTO;
  onUpdated: (ag: AgendamentoResponseDTO) => void;
  onMessage?: (msg: string | null) => void;
  onError?: (err: string | null) => void;
}

function canManageAtraso(role: Role | null): boolean {
  return role === "ADMIN" || role === "RECEPCIONISTA" || role === "BARBEIRO";
}

function atrasoPendenteResposta(ag: AgendamentoResponseDTO): boolean {
  if (ag.atrasoMinutos == null || ag.atrasoInformadoEm == null) {
    return false;
  }
  return (
    ag.atrasoStatus === "INFORMADO" ||
    ag.atrasoStatus == null ||
    ag.atrasoStatus === undefined
  );
}

export function AtrasoPanel({
  agendamento,
  onUpdated,
  onMessage,
  onError,
}: AtrasoPanelProps) {
  const { role } = useAuth();
  const isCliente = role === "CLIENTE";
  const isStaff = canManageAtraso(role);

  const [minutos, setMinutos] = useState("15");
  const [motivo, setMotivo] = useState("");
  const [chatText, setChatText] = useState("");
  const [mensagens, setMensagens] = useState<AtrasoMensagemResponseDTO[]>([]);
  const [busy, setBusy] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const hasAtraso = agendamento.atrasoMinutos != null;
  const minutosInformados = agendamento.atrasoMinutos ?? 0;

  const canInform =
    isCliente &&
    !hasAtraso &&
    agendamento.status !== "CANCELADO" &&
    agendamento.status !== "CONCLUIDO" &&
    agendamento.status !== "FALTOU";

  const canDecidirStaff = isStaff && atrasoPendenteResposta(agendamento);

  const mensagensExibidas = useMemo((): AtrasoMensagemResponseDTO[] => {
    if (mensagens.length > 0) {
      return mensagens;
    }
    if (hasAtraso && agendamento.atrasoMotivo) {
      return [
        {
          id: "legado-informe",
          agendamentoId: agendamento.id,
          autorUserId: agendamento.cliente.id,
          autorNome: agendamento.cliente.nome,
          autorRole: "CLIENTE",
          texto: `Informei atraso de ${agendamento.atrasoMinutos} min. Motivo: ${agendamento.atrasoMotivo}`,
          respostaOficial: false,
          createdAt: agendamento.atrasoInformadoEm ?? agendamento.inicio,
        },
      ];
    }
    return [];
  }, [mensagens, hasAtraso, agendamento]);

  const loadMensagens = useCallback(async () => {
    if (!hasAtraso) return;
    try {
      setMensagens(await listAtrasoMensagens(agendamento.id));
    } catch {
      /* opcional */
    }
  }, [agendamento.id, hasAtraso]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadMensagens(), 0);
    return () => window.clearTimeout(timer);
  }, [loadMensagens]);

  const handleInformar = async () => {
    setBusy(true);
    onError?.(null);
    const m = Number(minutos);
    if (!Number.isFinite(m) || m < 1 || m > 180) {
      onError?.("Informe entre 1 e 180 minutos.");
      setBusy(false);
      return;
    }
    if (!motivo.trim()) {
      onError?.("Informe o motivo.");
      setBusy(false);
      return;
    }
    try {
      const updated = await informarAtraso(agendamento.id, {
        minutos: m,
        motivo: motivo.trim(),
      });
      onUpdated(updated);
      onMessage?.("Atraso informado. A equipe foi notificada por e-mail.");
      setMotivo("");
      await loadMensagens();
    } catch (e) {
      onError?.(formatAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const handleConfirmar = async () => {
    setBusy(true);
    onError?.(null);
    try {
      const updated = await confirmarAtraso(agendamento.id);
      onUpdated(updated);
      onMessage?.(mensagemConfirmacaoAtraso(updated.atrasoMinutos ?? minutosInformados));
      await loadMensagens();
    } catch (e) {
      onError?.(formatAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const handleRecusar = async () => {
    setBusy(true);
    onError?.(null);
    try {
      const updated = await recusarAtraso(agendamento.id);
      onUpdated(updated);
      onMessage?.(mensagemRecusaAtraso());
      await loadMensagens();
    } catch (e) {
      onError?.(formatAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatText.trim()) return;
    setBusy(true);
    setChatError(null);
    onError?.(null);
    try {
      await sendAtrasoMensagem(agendamento.id, { texto: chatText.trim() });
      setChatText("");
      onMessage?.("Mensagem enviada.");
      await loadMensagens();
    } catch (e) {
      const msg = formatAuthError(e);
      setChatError(msg);
      onError?.(msg);
    } finally {
      setBusy(false);
    }
  };

  if (!canInform && !hasAtraso) {
    return (
      <p className="text-sm text-text-muted">
        {isCliente
          ? "Nenhum atraso informado. Você pode avisar a barbearia se não chegar no horário (até o início do atendimento)."
          : "Nenhum atraso informado pelo cliente."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {canInform && (
        <div className="space-y-4 rounded-xl border border-neon-primary/20 bg-bg-deep/50 p-4">
          <p className="text-xs text-text-muted">
            Avise a barbearia se não puder chegar no horário — mesmo com o
            agendamento já confirmado. A equipe será notificada por e-mail.
          </p>
          <Input
            label="Minutos de atraso (1–180)"
            name="atraso-minutos"
            type="number"
            min={1}
            max={180}
            value={minutos}
            onChange={(e) => setMinutos(e.target.value)}
            autoComplete="off"
          />
          <Textarea
            label="Motivo do atraso"
            name="atraso-motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex.: trânsito, consulta médica, imprevisto…"
            maxLength={500}
            autoComplete="off"
          />
          <Button
            type="button"
            variant="accent"
            fullWidth
            onClick={handleInformar}
            disabled={busy}
          >
            {busy ? "Enviando…" : "Informar atraso"}
          </Button>
        </div>
      )}

      {hasAtraso && (
        <div className="space-y-3 text-sm">
          <div className="rounded-lg border border-neon-primary/15 bg-neon-primary/5 px-3 py-2">
            <p className="font-medium text-neon-primary">
              {agendamento.atrasoMinutos} min de atraso
            </p>
            <p className="mt-1 text-text-muted">{agendamento.atrasoMotivo}</p>
            {agendamento.atrasoStatus && (
              <p className="mt-2 text-xs text-text-muted">
                Status:{" "}
                {labelStatusAtraso(
                  agendamento.atrasoStatus,
                  agendamento.atrasoMinutos,
                )}
              </p>
            )}
            {agendamento.atrasoConfirmadoEm && (
              <p className="mt-1 text-xs text-text-muted">
                Respondido em {formatDateTime(agendamento.atrasoConfirmadoEm)}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-neon-primary/15 bg-black/30 p-3">
            <p className="mb-2 text-xs uppercase tracking-wider text-text-muted">
              Conversa do atraso
            </p>

            {canDecidirStaff && (
              <div className="mb-3 space-y-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
                <p className="text-xs text-text-muted">
                  O cliente informou atraso. Confirme se vai aguardar — a agenda
                  será adiantada em <strong>{minutosInformados} min</strong>{" "}
                  para este atendimento e para os seguintes na fila do barbeiro.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="accent"
                    fullWidth
                    className="sm:flex-1"
                    onClick={handleConfirmar}
                    disabled={busy}
                  >
                    {busy ? "…" : `Aguardar (+${minutosInformados} min)`}
                  </Button>
                  <Button
                    variant="danger"
                    fullWidth
                    className="sm:flex-1"
                    onClick={handleRecusar}
                    disabled={busy}
                  >
                    Não vou aguardar
                  </Button>
                </div>
              </div>
            )}

            <div className="mb-3 max-h-44 space-y-2 overflow-y-auto">
              {mensagensExibidas.length === 0 && (
                <p className="text-xs text-text-muted">Nenhuma mensagem ainda.</p>
              )}
              {mensagensExibidas.map((m) => (
                <div
                  key={m.id}
                  className={[
                    "rounded-lg border px-2.5 py-2",
                    m.respostaOficial
                      ? "border-neon-primary/25 bg-neon-primary/10"
                      : "border-white/5 bg-white/5",
                  ].join(" ")}
                >
                  <p className="text-[10px] text-neon-primary">
                    {m.autorNome}
                    {m.respostaOficial ? " · resposta oficial" : ""}
                  </p>
                  <p className="text-xs leading-relaxed">{m.texto}</p>
                </div>
              ))}
            </div>
            {chatError && (
              <p className="mb-2 text-xs text-danger">{chatError}</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatText}
                onChange={(e) => {
                  setChatText(e.target.value);
                  if (chatError) setChatError(null);
                }}
                placeholder="Escreva uma mensagem…"
                maxLength={2000}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-lg border border-neon-primary/20 bg-bg-deep/80 px-3 py-2.5 text-sm text-foreground placeholder:text-text-muted/50 focus:border-neon-primary/50 focus:outline-none focus:ring-2 focus:ring-neon-primary/15"
              />
              <Button
                onClick={handleSendChat}
                disabled={busy || !chatText.trim()}
                className="shrink-0 px-4"
              >
                {busy ? "…" : "Enviar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
