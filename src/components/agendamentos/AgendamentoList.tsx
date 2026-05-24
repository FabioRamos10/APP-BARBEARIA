"use client";

import { useCallback, useEffect, useState } from "react";
import { AgendamentoCard } from "@/components/agendamentos/AgendamentoCard";
import { AgendamentoDetailPanel } from "@/components/agendamentos/AgendamentoDetailPanel";
import { Button } from "@/components/ui/Button";
import {
  cancelAgendamento,
  listAgendamentos,
  listAgendamentosByBarbeiro,
  listAgendamentosByCliente,
  updateAgendamentoStatus,
} from "@/lib/api/agendamento";
import { formatAuthError } from "@/contexts/AuthContext";
import type { AgendamentoResponseDTO } from "@/lib/types/dto";
import type { StatusAgendamento } from "@/lib/types/enums";
import {
  barberStatusActions,
  canCancel,
  STAFF_STATUS_OPTIONS,
  STATUS_LABELS,
} from "@/lib/utils/agendamento-status";

type ListMode = "all" | "cliente" | "barbeiro";

interface AgendamentoListProps {
  mode: ListMode;
  entityId?: string;
  allowCancel?: boolean;
  allowStatusChange?: "barbeiro" | "staff";
}

export function AgendamentoList({
  mode,
  entityId,
  allowCancel = false,
  allowStatusChange,
}: AgendamentoListProps) {
  const [items, setItems] = useState<AgendamentoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: AgendamentoResponseDTO[];
      if (mode === "all") {
        data = await listAgendamentos();
      } else if (mode === "cliente" && entityId) {
        data = await listAgendamentosByCliente(entityId);
      } else if (mode === "barbeiro" && entityId) {
        data = await listAgendamentosByBarbeiro(entityId);
      } else {
        data = [];
      }
      setItems(data);
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setLoading(false);
    }
  }, [mode, entityId]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void load().finally(() => {
        if (cancelled) return;
      });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [load]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancelar este agendamento?")) return;
    setBusyId(id);
    try {
      await cancelAgendamento(id);
      await load();
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setBusyId(null);
    }
  };

  const handleStatus = async (id: string, status: StatusAgendamento) => {
    setBusyId(id);
    try {
      await updateAgendamentoStatus(id, status);
      await load();
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-text-muted">Carregando agendamentos…</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
        {error}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="glass-panel rounded-xl p-6 text-center text-sm text-text-muted">
        Nenhum agendamento encontrado.
      </p>
    );
  }

  return (
    <>
    <ul className="space-y-4">
      {items.map((ag) => (
        <li key={ag.id}>
          <AgendamentoCard
            agendamento={ag}
            actions={
              <>
                <Button variant="ghost" onClick={() => setDetailId(ag.id)}>
                  Detalhes
                </Button>
                {allowCancel && canCancel(ag.status) && (
                  <Button
                    variant="danger"
                    disabled={busyId === ag.id}
                    onClick={() => handleCancel(ag.id)}
                  >
                    Cancelar
                  </Button>
                )}
                {allowStatusChange === "barbeiro" &&
                  barberStatusActions(ag.status).map((action) => (
                    <Button
                      key={action.status}
                      variant="ghost"
                      disabled={busyId === ag.id}
                      onClick={() => handleStatus(ag.id, action.status)}
                    >
                      {action.label}
                    </Button>
                  ))}
                {allowStatusChange === "staff" && (
                  <select
                    aria-label="Alterar status"
                    className="rounded-lg border border-neon-primary/20 bg-bg-deep/80 px-3 py-2 text-xs text-foreground"
                    value={ag.status}
                    disabled={busyId === ag.id}
                    onChange={(e) =>
                      handleStatus(ag.id, e.target.value as StatusAgendamento)
                    }
                  >
                    {STAFF_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                )}
              </>
            }
          />
        </li>
      ))}
    </ul>
    <AgendamentoDetailPanel
      agendamentoId={detailId}
      onClose={() => setDetailId(null)}
      onUpdated={load}
    />
    </>
  );
}
