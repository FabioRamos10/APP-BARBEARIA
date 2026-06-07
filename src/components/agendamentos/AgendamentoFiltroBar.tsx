"use client";

import type { AgendaAba } from "@/lib/utils/agendamento-status";
import { AGENDA_ABAS } from "@/lib/utils/agendamento-status";

interface AgendamentoFiltroBarProps {
  value: AgendaAba;
  onChange: (value: AgendaAba) => void;
  counts: Record<AgendaAba, number>;
}

export function AgendamentoFiltroBar({
  value,
  onChange,
  counts,
}: AgendamentoFiltroBarProps) {
  const activeMeta = AGENDA_ABAS.find((a) => a.value === value);

  return (
    <div className="mb-6 space-y-3">
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        role="tablist"
        aria-label="Abas da agenda"
      >
        {AGENDA_ABAS.map((opt) => {
          const active = value === opt.value;
          const count = counts[opt.value];
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(opt.value)}
              className={[
                "flex flex-col items-center justify-center gap-0.5 rounded-xl border px-3 py-3 text-center transition-all duration-200",
                active
                  ? "border-neon-primary bg-gradient-to-b from-neon-primary/25 to-neon-primary/5 text-neon-primary shadow-[0_0_20px_rgba(0,255,156,0.12)]"
                  : "border-neon-primary/15 bg-bg-surface/60 text-text-muted hover:border-neon-primary/35 hover:text-neon-primary",
              ].join(" ")}
            >
              <span className="text-sm font-medium">{opt.label}</span>
              <span
                className={[
                  "text-lg font-display font-semibold tabular-nums leading-none",
                  active ? "text-neon-primary" : "text-foreground/80",
                ].join(" ")}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      {activeMeta && (
        <p className="text-center text-xs text-text-muted sm:text-left">
          {activeMeta.descricao}
        </p>
      )}
    </div>
  );
}
