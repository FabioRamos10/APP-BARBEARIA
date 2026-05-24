"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { GlassCard } from "@/components/ui/GlassCard";
import { PublicacaoMidias } from "@/components/sobre-nos/PublicacaoMidias";
import {
  createPublicacao,
  createPublicacaoComMidias,
  deletePublicacao,
  listPublicacoesAdmin,
} from "@/lib/api/sobre-nos";
import { formatAuthError } from "@/contexts/AuthContext";
import type { PublicacaoResponseDTO } from "@/lib/types/dto";
import { TIPOS_PUBLICACAO, type TipoPublicacao } from "@/lib/types/enums";

const ACCEPT_MIDIA =
  "image/jpeg,image/png,image/webp,image/gif,application/pdf";

export function SobreNosAdmin() {
  const [items, setItems] = useState<PublicacaoResponseDTO[]>([]);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [tipo, setTipo] = useState<TipoPublicacao>("NOTICIA");
  const [avaliacaoId, setAvaliacaoId] = useState("");
  const [capa, setCapa] = useState<File | null>(null);
  const [anexos, setAnexos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const capaRef = useRef<HTMLInputElement>(null);
  const anexosRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setItems(await listPublicacoesAdmin());
    } catch (e) {
      setError(formatAuthError(e));
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const dtoBase = () => ({
    titulo: titulo.trim(),
    conteudo: conteudo.trim(),
    tipo,
    avaliacaoId:
      tipo === "AVALIACAO_DESTAQUE" && avaliacaoId.trim()
        ? avaliacaoId.trim()
        : undefined,
    publicado: true,
  });

  const resetForm = () => {
    setTitulo("");
    setConteudo("");
    setAvaliacaoId("");
    setCapa(null);
    setAnexos([]);
    if (capaRef.current) capaRef.current.value = "";
    if (anexosRef.current) anexosRef.current.value = "";
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const dto = dtoBase();
      if (capa || anexos.length > 0) {
        await createPublicacaoComMidias(dto, capa, anexos);
      } else {
        await createPublicacao(dto);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(formatAuthError(err));
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard title="Nova publicação">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoPublicacao)}
            options={TIPOS_PUBLICACAO.map((t) => ({ value: t, label: t }))}
            placeholder=""
          />
          <Input
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <Textarea
            label="Conteúdo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            required
          />
          {tipo === "AVALIACAO_DESTAQUE" && (
            <Input
              label="ID da avaliação (UUID)"
              value={avaliacaoId}
              onChange={(e) => setAvaliacaoId(e.target.value)}
            />
          )}
          <div className="space-y-2">
            <label className="block text-sm text-text-muted">
              Capa (imagem principal)
            </label>
            <input
              ref={capaRef}
              type="file"
              accept={ACCEPT_MIDIA}
              onChange={(e) => setCapa(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-text-muted file:mr-3 file:rounded file:border-0 file:bg-neon-primary/20 file:px-3 file:py-1.5 file:text-neon-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-text-muted">
              Galeria / anexos (fotos ou PDF)
            </label>
            <input
              ref={anexosRef}
              type="file"
              accept={ACCEPT_MIDIA}
              multiple
              onChange={(e) =>
                setAnexos(e.target.files ? Array.from(e.target.files) : [])
              }
              className="block w-full text-sm text-text-muted file:mr-3 file:rounded file:border-0 file:bg-neon-primary/20 file:px-3 file:py-1.5 file:text-neon-primary"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit">Publicar</Button>
        </form>
      </GlassCard>

      <GlassCard title="Todas as publicações">
        <ul className="space-y-4 text-sm">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-2 border-b border-neon-primary/10 py-3 sm:flex-row sm:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <p>
                  [{p.tipo}] {p.titulo}{" "}
                  {p.publicado ? "" : "(rascunho)"}
                </p>
                <PublicacaoMidias publicacao={p} showCapa compact />
              </div>
              <Button
                variant="ghost"
                className="shrink-0 self-start"
                onClick={() => void deletePublicacao(p.id).then(load)}
              >
                Excluir
              </Button>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
