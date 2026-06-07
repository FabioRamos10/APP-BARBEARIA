"use client";

import type { ReactNode } from "react";
import type { AgendamentoResponseDTO } from "@/lib/types/dto";
import { formatDateTime } from "@/lib/utils/format";
import { servicosLabel } from "@/lib/utils/agendamento-status";
import { StatusBadge } from "./StatusBadge";

interface AgendamentoCardProps {
  agendamento: AgendamentoResponseDTO;
  actions?: ReactNode;
}

export function AgendamentoCard({ agendamento, actions }: AgendamentoCardProps) {
  const servicos = servicosLabel(agendamento);

  return (
    <article className="glass-panel rounded-xl p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-foreground">{servicos}</h3>
            <StatusBadge status={agendamento.status} />
          </div>
          <p className="mt-1 text-sm text-neon-primary">
            {formatDateTime(agendamento.inicio)} — {formatDateTime(agendamento.fim)}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Cliente: {agendamento.cliente.nome} · Barbeiro:{" "}
            {agendamento.barbeiro.nome}
          </p>
          {agendamento.atrasoMinutos != null && agendamento.atrasoStatus && (
            <p className="mt-1 text-xs text-warning">
              Atraso: {agendamento.atrasoMinutos} min ({agendamento.atrasoStatus})
            </p>
          )}
          {agendamento.observacoes && (
            <p className="mt-2 text-xs text-text-muted">
              Obs: {agendamento.observacoes}
            </p>
          )}
        </div>
        {actions ? (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </article>
  );
}
