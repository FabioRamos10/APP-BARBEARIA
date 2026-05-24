"use client";

import type {
  AgendaDisponivelResponseDTO,
  HorarioDisponivelDTO,
} from "@/lib/types/dto";
import {
  formatDateFromYmd,
  formatTimeFromIso,
  formatTimeFromLocalTime,
  hourFromIso,
} from "@/lib/utils/datetime";

interface DisponibilidadeAgendaProps {
  canLoad: boolean;
  loading: boolean;
  data: string;
  disponibilidade: AgendaDisponivelResponseDTO | null;
  horarios: HorarioDisponivelDTO[];
  inicio: string;
  onSelect: (inicio: string) => void;
  totalDuracao: number;
}

function FormSectionHeader({
  step,
  title,
  hint,
}: {
  step: number;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neon-primary/40 bg-neon-primary/10 text-xs font-bold text-neon-primary"
        aria-hidden
      >
        {step}
      </span>
      <div className="min-w-0 pt-0.5">
        <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
          {title}
        </h3>
        {hint && <p className="mt-0.5 text-xs text-text-muted">{hint}</p>}
      </div>
    </div>
  );
}

function groupHorarios(horarios: HorarioDisponivelDTO[]) {
  const manha: HorarioDisponivelDTO[] = [];
  const tarde: HorarioDisponivelDTO[] = [];

  for (const slot of horarios) {
    if (hourFromIso(slot.inicio) < 12) {
      manha.push(slot);
    } else {
      tarde.push(slot);
    }
  }

  return { manha, tarde };
}

function SlotGrid({
  slots,
  inicio,
  onSelect,
}: {
  slots: HorarioDisponivelDTO[];
  inicio: string;
  onSelect: (inicio: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
      {slots.map((slot) => {
        const selected = inicio === slot.inicio;
        return (
          <button
            key={slot.inicio}
            type="button"
            onClick={() => onSelect(slot.inicio)}
            aria-pressed={selected}
            className={[
              "group relative flex flex-col items-center justify-center rounded-xl border px-2 py-3 text-sm font-medium transition-all duration-200",
              selected
                ? "border-neon-primary bg-neon-primary/20 text-neon-primary shadow-[0_0_20px_rgba(0,255,156,0.2)]"
                : "border-neon-primary/15 bg-bg-deep/50 text-foreground hover:border-neon-primary/45 hover:bg-neon-primary/5",
            ].join(" ")}
          >
            <span className="font-display text-base tracking-wide">
              {formatTimeFromIso(slot.inicio)}
            </span>
            <span className="mt-0.5 text-[10px] text-text-muted group-hover:text-neon-primary/80">
              até {formatTimeFromIso(slot.fim)}
            </span>
            {selected && (
              <span
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-primary text-[10px] font-bold text-bg-deep"
                aria-hidden
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-[4.25rem] animate-pulse rounded-xl border border-neon-primary/10 bg-bg-elevated/80"
        />
      ))}
    </div>
  );
}

export function DisponibilidadeAgenda({
  canLoad,
  loading,
  data,
  disponibilidade,
  horarios,
  inicio,
  onSelect,
  totalDuracao,
}: DisponibilidadeAgendaProps) {
  const selectedSlot = horarios.find((s) => s.inicio === inicio);
  const abertura = disponibilidade
    ? formatTimeFromLocalTime(disponibilidade.abertura)
    : "08:00";
  const fechamento = disponibilidade
    ? formatTimeFromLocalTime(disponibilidade.fechamento)
    : "18:00";
  const duracao =
    disponibilidade?.duracaoTotalMinutos ?? totalDuracao;

  const { manha, tarde } = groupHorarios(horarios);

  return (
    <section className="flex h-full min-h-[280px] flex-col rounded-2xl border border-neon-primary/15 bg-bg-deep/40 p-4 sm:p-5">
      <FormSectionHeader
        step={3}
        title="Escolha o horário"
        hint="Somente horários livres para o barbeiro e serviços selecionados"
      />

      <div className="mt-4 flex flex-1 flex-col">
        {!canLoad && (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-neon-primary/20 bg-bg-surface/30 px-6 py-10 text-center">
            <span
              className="font-display mb-3 text-3xl text-neon-primary/40"
              aria-hidden
            >
              ◷
            </span>
            <p className="text-sm font-medium text-foreground">
              Agenda indisponível
            </p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-text-muted">
              Selecione os serviços, o barbeiro e a data para carregar os
              horários livres.
            </p>
          </div>
        )}

        {canLoad && loading && (
          <div className="mt-2 space-y-3">
            <p className="text-xs text-text-muted">Buscando horários livres…</p>
            <LoadingSkeleton />
          </div>
        )}

        {canLoad && !loading && horarios.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-warning/30 bg-warning/5 px-6 py-10 text-center">
            <span className="mb-3 text-2xl text-warning/80" aria-hidden>
              ∅
            </span>
            <p className="text-sm font-medium text-foreground">
              Nenhum horário nesta data
            </p>
            <p className="mt-1 max-w-xs text-xs text-text-muted">
              Tente outro dia ou outro profissional — a agenda pode estar cheia.
            </p>
          </div>
        )}

        {canLoad && !loading && horarios.length > 0 && (
          <div className="mt-4 flex flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-neon-primary/30 bg-neon-primary/10 px-3 py-1 text-xs font-medium capitalize text-neon-primary">
                {data ? formatDateFromYmd(data) : ""}
              </span>
              <span className="rounded-full border border-neon-primary/15 bg-bg-surface px-3 py-1 text-xs text-text-muted">
                {horarios.length} horário{horarios.length !== 1 ? "s" : ""}{" "}
                livre{horarios.length !== 1 ? "s" : ""}
              </span>
              <span className="rounded-full border border-neon-primary/15 bg-bg-surface px-3 py-1 text-xs text-text-muted">
                {abertura} – {fechamento}
              </span>
              {duracao > 0 && (
                <span className="rounded-full border border-neon-primary/15 bg-bg-surface px-3 py-1 text-xs text-text-muted">
                  {duracao} min de atendimento
                </span>
              )}
            </div>

            <div className="max-h-[min(22rem,50vh)] flex-1 space-y-5 overflow-y-auto pr-1">
              {manha.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                    <span className="h-px flex-1 bg-neon-primary/15" />
                    Manhã
                    <span className="h-px flex-1 bg-neon-primary/15" />
                  </p>
                  <SlotGrid
                    slots={manha}
                    inicio={inicio}
                    onSelect={onSelect}
                  />
                </div>
              )}
              {tarde.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                    <span className="h-px flex-1 bg-neon-primary/15" />
                    Tarde
                    <span className="h-px flex-1 bg-neon-primary/15" />
                  </p>
                  <SlotGrid
                    slots={tarde}
                    inicio={inicio}
                    onSelect={onSelect}
                  />
                </div>
              )}
            </div>

            {selectedSlot && (
              <div className="rounded-xl border border-neon-primary/35 bg-neon-primary/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neon-primary">
                  Horário selecionado
                </p>
                <p className="mt-1 font-display text-lg text-foreground">
                  {formatTimeFromIso(selectedSlot.inicio)}
                  <span className="mx-2 text-text-muted">→</span>
                  {formatTimeFromIso(selectedSlot.fim)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export { FormSectionHeader };
