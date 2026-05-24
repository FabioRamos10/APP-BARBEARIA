"use client";

import type { ReactNode } from "react";
import type { AgendamentoResponseDTO } from "@/lib/types/dto";
import { formatDateTime } from "@/lib/utils/format";
import { StatusBadge } from "./StatusBadge";

interface AgendamentoCardProps {
  agendamento: AgendamentoResponseDTO;
  actions?: ReactNode;
}

export function AgendamentoCard({ agendamento, actions }: AgendamentoCardProps) {
  return (
    <article className="glass-panel rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-foreground">
              {agendamento.servico.nome}
            </h3>
            <StatusBadge status={agendamento.status} />
          </div>
          <p className="mt-1 text-sm text-neon-primary">
            {formatDateTime(agendamento.inicio)} — {formatDateTime(agendamento.fim)}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Cliente: {agendamento.cliente.nome} · Barbeiro:{" "}
            {agendamento.barbeiro.nome}
          </p>
          {agendamento.observacoes && (
            <p className="mt-2 text-xs text-text-muted">
              Obs: {agendamento.observacoes}
            </p>
          )}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </article>
  );
}
