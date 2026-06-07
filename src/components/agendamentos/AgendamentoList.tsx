"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AgendamentoCard } from "@/components/agendamentos/AgendamentoCard";
import { AgendamentoDetailPanel } from "@/components/agendamentos/AgendamentoDetailPanel";
import { AgendamentoFiltroBar } from "@/components/agendamentos/AgendamentoFiltroBar";
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
  countAgendamentosByAba,
  filterAgendamentosByAba,
  sortAgendamentosForAgenda,
  STAFF_STATUS_OPTIONS,
  STATUS_LABELS,
  type AgendaAba,
} from "@/lib/utils/agendamento-status";
import { dateKeyFromIso, formatAgendaDayLabel } from "@/lib/utils/datetime";

type ListMode = "all" | "cliente" | "barbeiro";

interface AgendamentoListProps {
  mode: ListMode;
  entityId?: string;
  allowCancel?: boolean;
  allowStatusChange?: "barbeiro" | "staff";
  /** Aba inicial (padrão: Próximos) */
  defaultAba?: AgendaAba;
}

function groupByDay(
  items: AgendamentoResponseDTO[],
  aba: AgendaAba,
): [string, AgendamentoResponseDTO[]][] {
  const map = new Map<string, AgendamentoResponseDTO[]>();
  for (const ag of items) {
    const key = dateKeyFromIso(ag.inicio);
    const list = map.get(key) ?? [];
    list.push(ag);
    map.set(key, list);
  }
  const desc = aba !== "PROXIMOS";
  return [...map.entries()].sort(([a], [b]) =>
    desc ? b.localeCompare(a) : a.localeCompare(b),
  );
}

export function AgendamentoList({
  mode,
  entityId,
  allowCancel = false,
  allowStatusChange,
  defaultAba = "PROXIMOS",
}: AgendamentoListProps) {
  const [items, setItems] = useState<AgendamentoResponseDTO[]>([]);
  const [aba, setAba] = useState<AgendaAba>(defaultAba);
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

  const counts = useMemo(() => countAgendamentosByAba(items), [items]);

  const filtered = useMemo(() => {
    const list = filterAgendamentosByAba(items, aba);
    return sortAgendamentosForAgenda(list, aba);
  }, [items, aba]);

  const grouped = useMemo(() => groupByDay(filtered, aba), [filtered, aba]);

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

  const renderActions = (ag: AgendamentoResponseDTO) => (
    <>
      <Button
        variant="outline"
        fullWidth
        className="sm:w-auto"
        onClick={() => setDetailId(ag.id)}
      >
        Detalhes
      </Button>
      {allowCancel && canCancel(ag.status) && (
        <Button
          variant="danger"
          fullWidth
          className="sm:w-auto"
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
            fullWidth
            className="sm:w-auto"
            disabled={busyId === ag.id}
            onClick={() => handleStatus(ag.id, action.status)}
          >
            {action.label}
          </Button>
        ))}
      {allowStatusChange === "staff" && (
        <select
          aria-label="Alterar status"
          className="w-full rounded-xl border border-neon-primary/20 bg-bg-deep/80 px-3 py-2.5 text-xs text-foreground sm:w-auto"
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
  );

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

  return (
    <>
      <AgendamentoFiltroBar value={aba} onChange={setAba} counts={counts} />

      {items.length === 0 && (
        <p className="glass-panel rounded-xl p-6 text-center text-sm text-text-muted">
          Nenhum agendamento encontrado.
        </p>
      )}

      {items.length > 0 && filtered.length === 0 && (
        <p className="glass-panel rounded-xl p-6 text-center text-sm text-text-muted">
          Nenhum agendamento nesta aba.
        </p>
      )}

      {filtered.length > 0 && (
        <div className="space-y-8">
          {grouped.map(([dayKey, dayItems]) => (
            <section key={dayKey}>
              <h2 className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-neon-primary/80">
                {formatAgendaDayLabel(dayKey)}
                <span className="ml-2 text-text-muted">({dayItems.length})</span>
              </h2>
              <ul className="space-y-3">
                {dayItems.map((ag) => (
                  <li key={ag.id}>
                    <AgendamentoCard
                      agendamento={ag}
                      actions={renderActions(ag)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <AgendamentoDetailPanel
        agendamentoId={detailId}
        onClose={() => setDetailId(null)}
        onUpdated={load}
      />
    </>
  );
}
