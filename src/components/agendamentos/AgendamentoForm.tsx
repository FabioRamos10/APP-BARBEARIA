"use client";

import { useCallback, useEffect, useState } from "react";
import { DisponibilidadeAgenda, FormSectionHeader } from "@/components/agendamentos/DisponibilidadeAgenda";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { GlassCard } from "@/components/ui/GlassCard";
import { createAgendamento, getDisponibilidade } from "@/lib/api/agendamento";
import { getAvaliacoesByBarbeiro } from "@/lib/api/avaliacao";
import { listBarbeirosAtivos } from "@/lib/api/barbeiro";
import { listClientes } from "@/lib/api/cliente";
import { listServicos } from "@/lib/api/servico";
import { formatAuthError } from "@/contexts/AuthContext";
import { isApiError } from "@/lib/api/errors";
import type {
  AgendaDisponivelResponseDTO,
  BarbeiroResponseDTO,
  ClienteResponseDTO,
  ServicoResponseDTO,
} from "@/lib/types/dto";
import { formatCurrency } from "@/lib/utils/format";

import { minDateOnly, toApiDateTime } from "@/lib/utils/datetime";

interface AgendamentoFormProps {
  /** ID fixo do cliente (fluxo cliente) */
  clienteId?: string;
  onSuccess?: () => void;
}

export function AgendamentoForm({ clienteId, onSuccess }: AgendamentoFormProps) {
  const isStaff = !clienteId;

  const [clientes, setClientes] = useState<ClienteResponseDTO[]>([]);
  const [barbeiros, setBarbeiros] = useState<BarbeiroResponseDTO[]>([]);
  const [servicos, setServicos] = useState<ServicoResponseDTO[]>([]);

  const [selectedCliente, setSelectedCliente] = useState(clienteId ?? "");
  const [barbeiroId, setBarbeiroId] = useState("");
  const [servicoIds, setServicoIds] = useState<string[]>([]);
  const [data, setData] = useState("");
  const [inicio, setInicio] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [disponibilidade, setDisponibilidade] =
    useState<AgendaDisponivelResponseDTO | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [barbeiroMedia, setBarbeiroMedia] = useState<string | null>(null);

  const canLoadSlots = Boolean(barbeiroId && data && servicoIds.length > 0);
  const selectedBarbeiro = barbeiros.find((b) => b.id === barbeiroId);

  const loadSlots = useCallback(async () => {
    if (!canLoadSlots) {
      setDisponibilidade(null);
      setInicio("");
      return;
    }

    setLoadingSlots(true);
    setInicio("");
    setDisponibilidade(null);

    try {
      const res = await getDisponibilidade({
        barbeiroId,
        data,
        servicoIds,
      });
      setDisponibilidade(res);
    } catch (e) {
      setDisponibilidade(null);
      setError(formatAuthError(e));
    } finally {
      setLoadingSlots(false);
    }
  }, [barbeiroId, data, servicoIds, canLoadSlots]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      (async () => {
        try {
          const [b, s] = await Promise.all([
            listBarbeirosAtivos(),
            listServicos(),
          ]);
          if (!active) return;
          setBarbeiros(b);
          setServicos(s);
          if (isStaff) {
            const c = await listClientes();
            if (active) setClientes(c);
          }
        } catch (e) {
          if (active) setError(formatAuthError(e));
        } finally {
          if (active) setLoading(false);
        }
      })();
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [isStaff]);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots]);

  const selectedServicos = servicos.filter((s) => servicoIds.includes(s.id));
  const totalDuracao = selectedServicos.reduce(
    (acc, s) => acc + s.duracaoMinutos,
    0,
  );
  const totalPreco = selectedServicos.reduce(
    (acc, s) => acc + Number(s.preco),
    0,
  );

  const toggleServico = (id: string) => {
    setServicoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    if (!barbeiroId) {
      const timer = window.setTimeout(() => setBarbeiroMedia(null), 0);
      return () => window.clearTimeout(timer);
    }
    let active = true;
    const timer = window.setTimeout(() => {
      getAvaliacoesByBarbeiro(barbeiroId)
        .then((av) => {
          if (!active) return;
          if (av.totalAvaliacoes > 0 && av.mediaNotas != null) {
            setBarbeiroMedia(
              `★ ${Number(av.mediaNotas).toFixed(1)} · ${av.totalAvaliacoes} avaliações`,
            );
          } else {
            setBarbeiroMedia("Sem avaliações ainda");
          }
        })
        .catch(() => {
          if (active) setBarbeiroMedia(null);
        });
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [barbeiroId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    const cid = clienteId ?? selectedCliente;
    if (!cid || !barbeiroId || servicoIds.length === 0 || !data || !inicio) {
      setError(
        "Preencha todos os campos obrigatórios, selecione ao menos um serviço e escolha um horário disponível.",
      );
      setSubmitting(false);
      return;
    }

    try {
      await createAgendamento({
        clienteId: cid,
        barbeiroId,
        servicoIds,
        inicio: toApiDateTime(inicio),
        observacoes: observacoes.trim() || undefined,
      });
      setSuccess(true);
      setInicio("");
      setObservacoes("");
      if (!clienteId) {
        setBarbeiroId("");
        setServicoIds([]);
        setData("");
      }
      await loadSlots();
      onSuccess?.();
    } catch (err) {
      setError(formatAuthError(err));
      if (isApiError(err) && err.status === 409) {
        setError(
          "Horário indisponível para este barbeiro. Escolha outro horário.",
        );
        await loadSlots();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const horarios = disponibilidade?.horariosDisponiveis ?? [];

  if (loading) {
    return (
      <GlassCard title="Novo agendamento" subtitle="Carregando opções…">
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-xl bg-bg-elevated/80" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-40 animate-pulse rounded-xl bg-bg-elevated/80" />
            <div className="h-64 animate-pulse rounded-xl bg-bg-elevated/80" />
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      title="Novo agendamento"
      subtitle="Escolha os serviços, o profissional e um horário livre"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {isStaff && (
          <section className="rounded-xl border border-neon-primary/10 bg-bg-deep/30 p-4">
            <Select
              label="Cliente"
              name="clienteId"
              required
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
              options={clientes.map((c) => ({
                value: c.id,
                label: `${c.nome} (${c.email})`,
              }))}
            />
          </section>
        )}

        {/* Serviços */}
        <section>
          <FormSectionHeader
            step={1}
            title="Serviços"
            hint="Selecione um ou mais — a duração total define os horários disponíveis"
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {servicos.map((s) => {
              const selected = servicoIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleServico(s.id)}
                  aria-pressed={selected}
                  className={[
                    "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200",
                    selected
                      ? "border-neon-primary/50 bg-neon-primary/10 shadow-[0_0_16px_rgba(0,255,156,0.12)]"
                      : "border-neon-primary/15 bg-bg-deep/40 hover:border-neon-primary/35 hover:bg-bg-surface/50",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs",
                      selected
                        ? "border-neon-primary bg-neon-primary text-bg-deep"
                        : "border-neon-primary/30 bg-transparent",
                    ].join(" ")}
                    aria-hidden
                  >
                    {selected ? "✓" : ""}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      {s.nome}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-text-muted">
                      <span>{formatCurrency(Number(s.preco))}</span>
                      <span>{s.duracaoMinutos} min</span>
                      {s.categoria && (
                        <span className="text-neon-primary/70">
                          {s.categoria}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {servicoIds.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-neon-primary/25 bg-neon-primary/5 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neon-primary">
                Resumo
              </span>
              <span className="text-sm text-foreground">
                {selectedServicos.map((s) => s.nome).join(" · ")}
              </span>
              <span className="ml-auto text-sm font-medium text-neon-primary">
                {formatCurrency(totalPreco)} · {totalDuracao} min
              </span>
            </div>
          )}
        </section>

        {/* Profissional + agenda */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-stretch">
          <section className="space-y-4 rounded-2xl border border-neon-primary/15 bg-bg-deep/40 p-4 sm:p-5">
            <FormSectionHeader
              step={2}
              title="Profissional e data"
              hint="Defina quem irá atender e o dia do agendamento"
            />

            <div className="mt-4 space-y-4">
              <Select
                label="Barbeiro"
                name="barbeiroId"
                required
                value={barbeiroId}
                onChange={(e) => setBarbeiroId(e.target.value)}
                options={barbeiros.map((b) => ({
                  value: b.id,
                  label: b.nome,
                }))}
              />

              {selectedBarbeiro && (
                <div className="flex items-center gap-3 rounded-xl border border-neon-primary/15 bg-bg-surface/60 px-4 py-3">
                  <span
                    className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neon-primary/30 bg-neon-primary/10 text-sm font-bold text-neon-primary"
                    aria-hidden
                  >
                    {selectedBarbeiro.nome.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {selectedBarbeiro.nome}
                    </p>
                    {barbeiroMedia && (
                      <p className="text-xs text-neon-primary">{barbeiroMedia}</p>
                    )}
                  </div>
                </div>
              )}

              <Input
                label="Data do agendamento"
                name="data"
                type="date"
                required
                min={minDateOnly()}
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
          </section>

          <DisponibilidadeAgenda
            canLoad={canLoadSlots}
            loading={loadingSlots}
            data={data}
            disponibilidade={disponibilidade}
            horarios={horarios}
            inicio={inicio}
            onSelect={setInicio}
            totalDuracao={totalDuracao}
          />
        </div>

        <section className="rounded-xl border border-neon-primary/10 bg-bg-deep/30 p-4">
          <Textarea
            label="Observações (opcional)"
            name="observacoes"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex.: preferência de corte, alergia a produto…"
          />
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {error}
          </p>
        )}
        {success && (
          <p
            role="status"
            className="rounded-xl border border-neon-primary/30 bg-neon-primary/10 px-4 py-3 text-sm text-neon-primary"
          >
            Agendamento criado com sucesso!
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={submitting || !inicio || loadingSlots}
          className="py-3 text-base"
        >
          {submitting ? "Agendando…" : "Confirmar agendamento"}
        </Button>
      </form>
    </GlassCard>
  );
}
