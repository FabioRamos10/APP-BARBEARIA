"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PublicacaoMidias } from "@/components/sobre-nos/PublicacaoMidias";
import { listPublicacoes } from "@/lib/api/sobre-nos";
import { formatAuthError } from "@/contexts/AuthContext";
import type { PublicacaoResponseDTO } from "@/lib/types/dto";
import type { TipoPublicacao } from "@/lib/types/enums";

const TIPO_LABELS: Record<TipoPublicacao, string> = {
  NOTICIA: "Notícia",
  CONTRATACAO: "Contratação",
  ELOGIO: "Elogio",
  AVALIACAO_DESTAQUE: "Avaliação em destaque",
};

export function SobreNosFeed() {
  const [items, setItems] = useState<PublicacaoResponseDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPublicacoes()
      .then(setItems)
      .catch((e) => setError(formatAuthError(e)));
  }, []);

  if (error) {
    return <p className="text-sm text-danger">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {items.length === 0 && (
        <p className="text-center text-sm text-text-muted">
          Nenhuma publicação ainda.
        </p>
      )}
      {items.map((p) => (
        <GlassCard key={p.id}>
          <p className="text-xs uppercase tracking-wider text-neon-primary">
            {TIPO_LABELS[p.tipo]}
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold">{p.titulo}</h2>
          <PublicacaoMidias publicacao={p} />
          <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">
            {p.conteudo}
          </p>
          {p.tipo === "AVALIACAO_DESTAQUE" && p.avaliacaoNota != null && (
            <p className="mt-2 text-sm text-neon-primary">
              {"★".repeat(p.avaliacaoNota)}
              {p.avaliacaoComentario && ` — ${p.avaliacaoComentario}`}
            </p>
          )}
          {p.publicadoEm && (
            <p className="mt-2 text-xs text-text-muted">
              {new Date(p.publicadoEm).toLocaleDateString("pt-BR")}
            </p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
