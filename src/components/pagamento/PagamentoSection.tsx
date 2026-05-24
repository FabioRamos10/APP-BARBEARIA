"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  baixarComprovanteBlob,
  confirmarPagamento,
  createPagamento,
  enviarComprovante,
} from "@/lib/api/pagamento";
import { formatAuthError } from "@/contexts/AuthContext";
import type { AgendamentoResponseDTO, PagamentoResponseDTO } from "@/lib/types/dto";
import type { FormaPagamento, Role, StatusAgendamento } from "@/lib/types/enums";
import { FORMAS_PAGAMENTO } from "@/lib/types/enums";
import { formatCurrency } from "@/lib/utils/format";
import {
  FORMA_PAGAMENTO_LABELS,
  STATUS_PAGAMENTO_LABELS,
} from "@/lib/utils/pagamento";

interface PagamentoSectionProps {
  agendamento: AgendamentoResponseDTO;
  pagamento: PagamentoResponseDTO | null;
  role: Role | null;
  onUpdated: (pagamento: PagamentoResponseDTO | null) => void;
  onMessage?: (msg: string | null) => void;
  onError?: (err: string | null) => void;
}

function canManagePagamento(role: Role | null): boolean {
  return role === "ADMIN" || role === "RECEPCIONISTA" || role === "BARBEIRO";
}

function allowsPaymentForm(status: StatusAgendamento): boolean {
  return status === "CONCLUIDO" || status === "EM_ANDAMENTO";
}

export function PagamentoSection({
  agendamento,
  pagamento,
  role,
  onUpdated,
  onMessage,
  onError,
}: PagamentoSectionProps) {
  const isCliente = role === "CLIENTE";
  const isStaff = canManagePagamento(role);

  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("PIX");
  const [valorPagamento, setValorPagamento] = useState("");
  const [pixImediato, setPixImediato] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  const canCreate =
    isStaff && allowsPaymentForm(agendamento.status) && !pagamento;

  const canConfirm =
    isStaff && pagamento?.status === "PENDENTE";

  const showPixCliente =
    isCliente &&
    agendamento.status === "CONCLUIDO" &&
    pagamento?.formaPagamento === "PIX" &&
    pagamento.status === "PENDENTE";

  const handleCreate = async () => {
    setBusy(true);
    onError?.(null);
    onMessage?.(null);
    try {
      const created = await createPagamento({
        agendamentoId: agendamento.id,
        formaPagamento,
        valor: valorPagamento ? Number(valorPagamento) : undefined,
        confirmarImediato:
          formaPagamento === "PIX" ? pixImediato : true,
        observacao: observacao.trim() || undefined,
      });
      onUpdated(created);
      onMessage?.("Pagamento registrado.");
    } catch (e) {
      onError?.(formatAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const handleConfirm = async () => {
    if (!pagamento) return;
    setBusy(true);
    onError?.(null);
    try {
      const updated = await confirmarPagamento(pagamento.id);
      onUpdated(updated);
      onMessage?.("Pagamento confirmado.");
    } catch (e) {
      onError?.(formatAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const handleCopyPix = async () => {
    if (!pagamento?.pixCopiaCola) return;
    await navigator.clipboard.writeText(pagamento.pixCopiaCola);
    onMessage?.("Código PIX copiado.");
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file || !pagamento) return;
    setUploading(true);
    onError?.(null);
    try {
      const updated = await enviarComprovante(pagamento.id, file);
      onUpdated(updated);
      onMessage?.("Comprovante enviado. A equipe foi notificada.");
    } catch (e) {
      onError?.(formatAuthError(e));
    } finally {
      setUploading(false);
    }
  };

  const handleViewComprovante = async () => {
    if (!pagamento) return;
    try {
      const blob = await baixarComprovanteBlob(pagamento.id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      onError?.(formatAuthError(e));
    }
  };

  if (!pagamento && !canCreate && agendamento.status === "CONCLUIDO" && isCliente) {
    return (
      <p className="text-sm text-text-muted">
        O PIX será gerado em instantes após a conclusão do atendimento. Atualize
        a página se não aparecer.
      </p>
    );
  }

  if (!pagamento && !canCreate) {
    return (
      <p className="text-sm text-text-muted">
        {isStaff
          ? "Disponível quando o atendimento estiver em andamento ou concluído."
          : "Nenhum pagamento registrado ainda."}
      </p>
    );
  }

  if (pagamento) {
    return (
      <div className="space-y-3 text-sm">
        <p>
          {FORMA_PAGAMENTO_LABELS[pagamento.formaPagamento]} ·{" "}
          <span className="text-neon-primary">
            {formatCurrency(Number(pagamento.valor))}
          </span>
        </p>
        <p className="text-text-muted">
          Status:{" "}
          <span className="text-foreground">
            {STATUS_PAGAMENTO_LABELS[pagamento.status]}
          </span>
        </p>

        {pagamento.comprovanteEnviado === true && (
          <p className="rounded-lg border border-neon-primary/25 bg-neon-primary/10 px-3 py-2 text-xs text-neon-primary">
            Comprovante enviado
            {pagamento.comprovanteEnviadoEm
              ? ` em ${new Date(pagamento.comprovanteEnviadoEm).toLocaleString("pt-BR")}`
              : ""}
          </p>
        )}

        {showPixCliente && pagamento.pixQrCodeUrl && (
          <div className="space-y-3 rounded-xl border border-neon-primary/20 bg-black/40 p-3">
            <p className="text-xs uppercase tracking-wider text-text-muted">
              Pague com PIX
            </p>
            <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-lg border border-neon-primary/30 bg-white">
              <Image
                src={pagamento.pixQrCodeUrl}
                alt="QR Code PIX"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            {pagamento.pixChave && (
              <p className="text-xs text-text-muted">
                Chave: <span className="text-foreground">{pagamento.pixChave}</span>
              </p>
            )}
            {pagamento.pixCopiaCola && (
              <Button variant="ghost" className="w-full text-xs" onClick={handleCopyPix}>
                Copiar PIX copia e cola
              </Button>
            )}
            {pagamento.comprovanteEnviado !== true && (
              <label className="block">
                <span className="mb-1.5 block text-xs text-text-muted">
                  Enviar comprovante (imagem ou PDF)
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  disabled={uploading}
                  onChange={(e) => void handleUpload(e.target.files?.[0])}
                  className="w-full text-xs text-text-muted file:mr-2 file:rounded file:border-0 file:bg-neon-primary/20 file:px-2 file:py-1 file:text-neon-primary"
                />
              </label>
            )}
          </div>
        )}

        {isStaff && pagamento.comprovanteEnviado === true && (
          <Button variant="ghost" onClick={handleViewComprovante}>
            Ver comprovante
          </Button>
        )}

        {canConfirm && (
          <Button onClick={handleConfirm} disabled={busy}>
            Confirmar pagamento
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Select
        label="Forma de pagamento"
        value={formaPagamento}
        onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
        options={FORMAS_PAGAMENTO.map((f) => ({
          value: f,
          label: FORMA_PAGAMENTO_LABELS[f],
        }))}
        placeholder=""
      />
      <Input
        label="Valor (opcional — usa preço do serviço)"
        type="number"
        min="0.01"
        step="0.01"
        value={valorPagamento}
        onChange={(e) => setValorPagamento(e.target.value)}
      />
      {formaPagamento === "PIX" && (
        <label className="flex items-center gap-2 text-xs text-text-muted">
          <input
            type="checkbox"
            checked={pixImediato}
            onChange={(e) => setPixImediato(e.target.checked)}
            className="rounded border-neon-primary/30"
          />
          Marcar como pago agora (sem aguardar comprovante)
        </label>
      )}
      {formaPagamento !== "PIX" && (
        <p className="text-xs text-text-muted">
          Cartão e dinheiro são registrados como pagos na hora (maquininha).
        </p>
      )}
      <Input
        label="Observação (opcional)"
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
      />
      <Button onClick={handleCreate} disabled={busy}>
        Registrar pagamento
      </Button>
    </div>
  );
}
