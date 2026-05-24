"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  countAlertasNaoLidos,
  listAlertas,
  marcarAlertaLido,
} from "@/lib/api/alerta";
import { formatAuthError } from "@/contexts/AuthContext";
import type { AlertaResponseDTO } from "@/lib/types/dto";

const PANEL_WIDTH = 320;
const PANEL_GAP = 8;

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function AlertasBell() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [total, setTotal] = useState(0);
  const [alertas, setAlertas] = useState<AlertaResponseDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [count, list] = await Promise.all([
        countAlertasNaoLidos(),
        listAlertas(),
      ]);
      setTotal(count.total);
      setAlertas(list.slice(0, 12));
      setError(null);
    } catch (e) {
      setError(formatAuthError(e));
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const timer = window.setTimeout(() => void refresh(), 0);
    const interval = window.setInterval(() => void refresh(), 60_000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const updatePanelPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let left = rect.right - PANEL_WIDTH;
    left = Math.max(
      PANEL_GAP,
      Math.min(left, window.innerWidth - PANEL_WIDTH - PANEL_GAP),
    );
    setPanelStyle({
      top: rect.bottom + PANEL_GAP,
      left,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPanelStyle(null);
      return;
    }
    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);
    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [open, updatePanelPosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleMarkRead = async (id: string) => {
    try {
      await marcarAlertaLido(id);
      await refresh();
    } catch (e) {
      setError(formatAuthError(e));
    }
  };

  const toggleOpen = () => {
    setOpen((v) => {
      const next = !v;
      if (next) void refresh();
      return next;
    });
  };

  const panel =
    open && mounted && panelStyle
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[200] cursor-default bg-black/40 backdrop-blur-[1px]"
              aria-label="Fechar notificações"
              onClick={() => setOpen(false)}
            />
            <div
              role="dialog"
              aria-label="Notificações"
              className="fixed z-[210] flex max-h-[min(70vh,24rem)] w-[min(calc(100vw-1rem),20rem)] flex-col overflow-hidden rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
              style={{
                top: panelStyle.top,
                left: panelStyle.left,
                width: PANEL_WIDTH,
              }}
            >
              <div className="flex items-center justify-between border-b border-neon-primary/15 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-neon-primary">
                  Notificações
                </p>
                {total > 0 && (
                  <span className="rounded-full bg-danger/90 px-2 py-0.5 text-[10px] font-bold text-white">
                    {total > 9 ? "9+" : total} não lidos
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-2">
                {error && (
                  <p className="mb-2 rounded-lg bg-danger/10 px-2 py-1.5 text-xs text-danger">
                    {error}
                  </p>
                )}
                {alertas.length === 0 && !error && (
                  <p className="py-6 text-center text-sm text-text-muted">
                    Nenhum alerta no momento.
                  </p>
                )}
                <ul className="space-y-2">
                  {alertas.map((a) => (
                    <li
                      key={a.id}
                      className={[
                        "rounded-lg border px-3 py-2.5 text-sm",
                        a.lido
                          ? "border-white/5 bg-white/[0.02] opacity-70"
                          : "border-neon-primary/30 bg-neon-primary/10",
                      ].join(" ")}
                    >
                      <p className="font-medium leading-snug text-foreground">
                        {a.titulo}
                      </p>
                      {a.mensagem && (
                        <p className="mt-1 text-xs leading-relaxed text-text-muted">
                          {a.mensagem}
                        </p>
                      )}
                      {!a.lido && (
                        <button
                          type="button"
                          className="mt-2 text-xs font-medium text-neon-primary hover:underline"
                          onClick={() => void handleMarkRead(a.id)}
                        >
                          Marcar como lido
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-neon-primary/15 bg-black/20 px-3 py-2.5">
                <Link
                  href="/dashboard/mensagens"
                  className="block rounded-lg py-2 text-center text-xs font-medium text-neon-primary transition hover:bg-neon-primary/10"
                  onClick={() => setOpen(false)}
                >
                  Abrir mensagens
                </Link>
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          total > 0 ? `Alertas, ${total} não lidos` : "Alertas"
        }
        className={[
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition",
          open
            ? "border-neon-primary bg-neon-primary/15 text-neon-primary"
            : "border-neon-primary/25 text-neon-primary hover:border-neon-primary/50 hover:bg-neon-primary/10",
        ].join(" ")}
      >
        <BellIcon />
        {total > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white ring-2 ring-bg-elevated">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>
      {panel}
    </>
  );
}
