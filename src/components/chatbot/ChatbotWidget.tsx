"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sendChatbotMessage } from "@/lib/api/chatbot";
import { getClienteMe } from "@/lib/api/cliente";
import { getBarbeiroMe } from "@/lib/api/barbeiro";
import { formatAuthError, useAuth } from "@/contexts/AuthContext";
import { buildChatWelcome } from "@/lib/utils/greeting";
import { formatChatMessage } from "@/lib/utils/format-chat";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  sugestoes?: string[];
}

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatbotWidget() {
  const { isAuthenticated, displayName: authDisplayName, email, role } =
    useAuth();
  const [open, setOpen] = useState(false);
  const [chatName, setChatName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [welcomed, setWelcomed] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const resolveName = useCallback(async (): Promise<string> => {
    if (authDisplayName) {
      return authDisplayName;
    }
    try {
      if (role === "CLIENTE") {
        const c = await getClienteMe();
        return c.nome;
      }
      if (role === "BARBEIRO") {
        const b = await getBarbeiroMe();
        return b.nome;
      }
    } catch {
      /* fallback */
    }
    if (email) {
      return email.split("@")[0] ?? "visitante";
    }
    return "visitante";
  }, [authDisplayName, role, email]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timer = window.setTimeout(() => {
      void resolveName().then(setChatName);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, resolveName]);

  useEffect(() => {
    if (!open || welcomed || chatName === null) {
      return;
    }
    const timer = window.setTimeout(() => {
      setMessages([
        {
          id: nextId(),
          role: "bot",
          text: buildChatWelcome(chatName),
        },
      ]);
      setWelcomed(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, welcomed, chatName]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) {
      return;
    }
    setError(null);
    setSending(true);
    setInput("");

    const userMsg: ChatMessage = { id: nextId(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await sendChatbotMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "bot",
          text: res.resposta,
          sugestoes: res.sugestoes?.length ? res.sugestoes : undefined,
        },
      ]);
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const toggle = () => {
    setOpen((v) => !v);
    if (open) {
      setWelcomed(false);
      setMessages([]);
      setChatName(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Fechar assistente CB" : "Abrir assistente CB"}
        className="group fixed top-5 left-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full border border-neon-primary/50 bg-black/80 font-display text-sm font-bold tracking-wider text-neon-primary shadow-[0_0_24px_rgba(57,255,20,0.35)] backdrop-blur-md transition-all hover:scale-105 hover:border-neon-primary hover:shadow-[0_0_36px_rgba(57,255,20,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-primary"
      >
        <span
          className="absolute inset-0 rounded-full border border-neon-primary/30 animate-ping opacity-20 group-hover:opacity-40"
          aria-hidden
        />
        <span className="relative">CB</span>
      </button>

      {open && (
        <div
          className="fixed top-24 left-5 z-[100] flex w-[min(100vw-2.5rem,22rem)] flex-col overflow-hidden rounded-2xl border border-neon-primary/30 bg-black/90 shadow-[0_0_48px_rgba(57,255,20,0.12)] backdrop-blur-xl"
          role="dialog"
          aria-label="Assistente CB"
        >
          <header className="flex items-center gap-3 border-b border-neon-primary/20 bg-gradient-to-r from-neon-primary/10 to-transparent px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-neon-primary/40 bg-black font-display text-xs font-bold text-neon-primary">
              CB
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold text-neon-primary">
                Assistente CB
              </p>
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-primary shadow-[0_0_6px_#39ff14]" />
                Online
              </p>
            </div>
            <button
              type="button"
              onClick={toggle}
              className="rounded-lg px-2 py-1 text-xs text-text-muted transition hover:bg-white/5 hover:text-white"
              aria-label="Fechar"
            >
              ✕
            </button>
          </header>

          <div
            ref={listRef}
            className="flex max-h-72 min-h-48 flex-1 flex-col gap-3 overflow-y-auto p-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "user"
                    ? "ml-6 rounded-2xl rounded-tr-sm border border-neon-primary/30 bg-neon-primary/15 px-3 py-2 text-sm text-white"
                    : "mr-2 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-muted"
                }
              >
                {msg.role === "bot" ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formatChatMessage(msg.text),
                    }}
                  />
                ) : (
                  msg.text
                )}
                {msg.sugestoes && msg.sugestoes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.sugestoes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={sending}
                        onClick={() => void sendMessage(s)}
                        className="rounded-full border border-neon-primary/25 bg-black/40 px-2.5 py-1 text-[11px] text-neon-primary transition hover:border-neon-primary/60 hover:bg-neon-primary/10 disabled:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <p className="text-xs text-text-muted animate-pulse">
                CB está digitando…
              </p>
            )}
          </div>

          {error && (
            <p className="px-4 pb-1 text-xs text-danger">{error}</p>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-neon-primary/15 p-3"
          >
            <input
              type="text"
              maxLength={1000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta…"
              disabled={sending}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-text-muted focus:border-neon-primary/50 focus:outline-none focus:ring-1 focus:ring-neon-primary/30 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-xl border border-neon-primary/40 bg-neon-primary/15 px-3 py-2 font-display text-xs font-semibold uppercase tracking-wide text-neon-primary transition hover:bg-neon-primary/25 disabled:opacity-40"
            >
              →
            </button>
          </form>
        </div>
      )}
    </>
  );
}
