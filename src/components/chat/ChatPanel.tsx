"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { AuthenticatedMedia } from "@/components/media/AuthenticatedMedia";
import {
  abrirConversa,
  enviarMensagemChat,
  enviarMensagemComAnexo,
  listChatUsuarios,
  listConversas,
  listMensagensChat,
  marcarConversaLida,
} from "@/lib/api/chat";
import { chatTopic, createChatStompClient } from "@/lib/chat/ws";
import { formatAuthError, useAuth } from "@/contexts/AuthContext";
import type {
  ChatMensagemResponseDTO,
  ConversaResponseDTO,
  UsuarioChatDTO,
} from "@/lib/types/dto";
import type { Client } from "@stomp/stompjs";

const ACCEPT_ANEXO =
  "image/jpeg,image/png,image/webp,image/gif,application/pdf";

function resolveRemetenteNome(
  m: ChatMensagemResponseDTO,
  usuarios: UsuarioChatDTO[],
  outroUserId: string | null,
  outroNome: string | null,
  meuNome: string | null,
): string {
  if (m.remetenteNome?.trim()) {
    return m.remetenteNome.trim();
  }
  if (outroUserId && m.remetenteUserId === outroUserId && outroNome) {
    return outroNome;
  }
  const u = usuarios.find((x) => x.userId === m.remetenteUserId);
  if (u?.nome) return u.nome;
  if (meuNome) return meuNome;
  return "Usuário";
}

function ChatMensagemConteudo({ m }: { m: ChatMensagemResponseDTO }) {
  const tipo = m.tipoConteudo ?? (m.anexoUrl ? "ARQUIVO" : "TEXTO");

  if (tipo === "IMAGEM" && m.anexoUrl) {
    return (
      <div className="space-y-2">
        {m.texto?.trim() && (
          <p className="whitespace-pre-wrap leading-relaxed">{m.texto}</p>
        )}
        <AuthenticatedMedia
          url={m.anexoUrl}
          alt={m.anexoNome ?? "Imagem"}
          className="max-h-56 rounded-lg object-contain"
        />
      </div>
    );
  }

  if (tipo === "ARQUIVO" && m.anexoUrl) {
    return (
      <div className="space-y-2">
        {m.texto?.trim() && (
          <p className="whitespace-pre-wrap leading-relaxed">{m.texto}</p>
        )}
        <AuthenticatedMedia
          url={m.anexoUrl}
          asDownload
          label={m.anexoNome ?? "Baixar anexo"}
        />
      </div>
    );
  }

  return (
    <p className="whitespace-pre-wrap leading-relaxed">{m.texto ?? ""}</p>
  );
}

export function ChatPanel() {
  const { displayName } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioChatDTO[]>([]);
  const [conversas, setConversas] = useState<ConversaResponseDTO[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<ConversaResponseDTO | null>(
    null,
  );
  const [mensagens, setMensagens] = useState<ChatMensagemResponseDTO[]>([]);
  const [texto, setTexto] = useState("");
  const [anexo, setAnexo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const stompRef = useRef<Client | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const anexoRef = useRef<HTMLInputElement>(null);

  const loadInicial = useCallback(async () => {
    setLoading(true);
    try {
      const [u, c] = await Promise.all([listChatUsuarios(), listConversas()]);
      setUsuarios(u);
      setConversas(c);
      setError(null);
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadInicial(), 0);
    return () => window.clearTimeout(timer);
  }, [loadInicial]);

  const selectConversa = useCallback(async (c: ConversaResponseDTO) => {
    setConversaAtiva(c);
    try {
      const msgs = await listMensagensChat(c.conversaId);
      setMensagens(msgs);
      await marcarConversaLida(c.conversaId);
      setError(null);
    } catch (e) {
      setError(formatAuthError(e));
    }
  }, []);

  const startWithUser = async (userId: string) => {
    try {
      const c = await abrirConversa(userId);
      setConversas((prev) => {
        const exists = prev.some((x) => x.conversaId === c.conversaId);
        return exists ? prev : [c, ...prev];
      });
      await selectConversa(c);
    } catch (e) {
      setError(formatAuthError(e));
    }
  };

  useEffect(() => {
    if (!conversaAtiva) return;

    const client = createChatStompClient(() => {
      client.subscribe(chatTopic(conversaAtiva.conversaId), (msg) => {
        try {
          const body = JSON.parse(msg.body) as ChatMensagemResponseDTO;
          setMensagens((prev) => {
            if (prev.some((m) => m.id === body.id)) return prev;
            return [...prev, body];
          });
        } catch {
          /* ignore */
        }
      });
    });
    client.activate();
    stompRef.current = client;

    return () => {
      void client.deactivate();
      stompRef.current = null;
    };
  }, [conversaAtiva?.conversaId]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensagens]);

  const handleSend = async () => {
    if (!conversaAtiva) return;
    const msg = texto.trim();
    if (!msg && !anexo) return;
    try {
      const sent = anexo
        ? await enviarMensagemComAnexo(
            conversaAtiva.conversaId,
            msg || undefined,
            anexo,
          )
        : await enviarMensagemChat(conversaAtiva.conversaId, { texto: msg });
      setTexto("");
      setAnexo(null);
      if (anexoRef.current) anexoRef.current.value = "";
      setMensagens((prev) =>
        prev.some((m) => m.id === sent.id) ? prev : [...prev, sent],
      );
    } catch (e) {
      setError(formatAuthError(e));
    }
  };

  if (loading) {
    return <p className="text-sm text-text-muted">Carregando chat…</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[14rem_1fr]">
      <GlassCard title="Conversas" className="lg:max-h-[32rem]">
        <p className="mb-2 text-xs text-text-muted">Usuários</p>
        <ul className="mb-4 max-h-28 space-y-1 overflow-y-auto text-xs">
          {usuarios.map((u) => (
            <li key={u.userId}>
              <button
                type="button"
                className="w-full rounded px-2 py-1 text-left hover:bg-neon-primary/10"
                onClick={() => void startWithUser(u.userId)}
              >
                {u.nome}
              </button>
            </li>
          ))}
        </ul>
        <ul className="max-h-40 space-y-1 overflow-y-auto text-sm">
          {conversas.map((c) => (
            <li key={c.conversaId}>
              <button
                type="button"
                className={[
                  "w-full rounded-lg px-2 py-2 text-left",
                  conversaAtiva?.conversaId === c.conversaId
                    ? "bg-neon-primary/15 text-neon-primary"
                    : "hover:bg-white/5",
                ].join(" ")}
                onClick={() => void selectConversa(c)}
              >
                {c.outroNome}
                {c.mensagensNaoLidas > 0 && (
                  <span className="ml-1 text-danger">
                    ({c.mensagensNaoLidas})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard
        title={conversaAtiva ? conversaAtiva.outroNome : "Mensagens"}
        className="flex min-h-[20rem] flex-col lg:max-h-[32rem]"
      >
        {error && <p className="mb-2 text-sm text-danger">{error}</p>}
        {!conversaAtiva ? (
          <p className="text-sm text-text-muted">
            Selecione uma conversa ou um usuário para começar.
          </p>
        ) : (
          <>
            <div
              ref={listRef}
              className="mb-3 flex-1 space-y-2 overflow-y-auto rounded-lg border border-neon-primary/10 p-3"
            >
              {mensagens.map((m) => {
                const nome = resolveRemetenteNome(
                  m,
                  usuarios,
                  conversaAtiva.outroUserId,
                  conversaAtiva.outroNome,
                  displayName,
                );
                return (
                  <div
                    key={m.id}
                    className="rounded-lg border border-white/5 bg-black/30 px-3 py-2 text-sm"
                  >
                    <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                      <p className="text-xs font-semibold text-neon-primary">
                        {nome}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {new Date(m.enviadaEm).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <ChatMensagemConteudo m={m} />
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2">
              {anexo && (
                <p className="text-xs text-text-muted">
                  Anexo: {anexo.name}{" "}
                  <button
                    type="button"
                    className="text-danger underline"
                    onClick={() => {
                      setAnexo(null);
                      if (anexoRef.current) anexoRef.current.value = "";
                    }}
                  >
                    remover
                  </button>
                </p>
              )}
              <div className="flex gap-2">
                <input
                  ref={anexoRef}
                  type="file"
                  accept={ACCEPT_ANEXO}
                  className="hidden"
                  onChange={(e) => setAnexo(e.target.files?.[0] ?? null)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => anexoRef.current?.click()}
                  title="Anexar imagem ou PDF"
                >
                  📎
                </Button>
                <input
                  type="text"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleSend();
                  }}
                  placeholder="Mensagem…"
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm"
                />
                <Button onClick={handleSend} disabled={!texto.trim() && !anexo}>
                  Enviar
                </Button>
              </div>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}
