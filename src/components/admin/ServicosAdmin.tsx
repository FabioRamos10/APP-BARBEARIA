"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import { createServico, listServicos, updateServico } from "@/lib/api/servico";
import { formatAuthError } from "@/contexts/AuthContext";
import type { ServicoResponseDTO } from "@/lib/types/dto";
import { formatCurrency } from "@/lib/utils/format";

export function ServicosAdmin() {
  const [servicos, setServicos] = useState<ServicoResponseDTO[]>([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [duracao, setDuracao] = useState("30");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editDuracao, setEditDuracao] = useState("");
  const [editCategoria, setEditCategoria] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setServicos(await listServicos());
    } catch (e) {
      setError(formatAuthError(e));
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createServico({
        nome,
        descricao: descricao || undefined,
        preco: Number(preco),
        duracaoMinutos: Number(duracao),
        categoria: categoria || undefined,
      });
      setNome("");
      setPreco("");
      setDescricao("");
      setCategoria("");
      await load();
    } catch (err) {
      setError(formatAuthError(err));
    }
  };

  const toggleAtivo = async (s: ServicoResponseDTO) => {
    try {
      await updateServico(s.id, { ativo: !s.ativo });
      await load();
    } catch (err) {
      setError(formatAuthError(err));
    }
  };

  const startEdit = (s: ServicoResponseDTO) => {
    setEditingId(s.id);
    setEditNome(s.nome);
    setEditPreco(String(s.preco));
    setEditDuracao(String(s.duracaoMinutos));
    setEditCategoria(s.categoria ?? "");
  };

  const saveEdit = async (id: string) => {
    setError(null);
    try {
      await updateServico(id, {
        nome: editNome,
        preco: Number(editPreco),
        duracaoMinutos: Number(editDuracao),
        categoria: editCategoria || undefined,
      });
      setEditingId(null);
      await load();
    } catch (err) {
      setError(formatAuthError(err));
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard title="Novo serviço">
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
          <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input label="Preço (R$)" type="number" min="0.01" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} required />
          <Input label="Duração (min)" type="number" min="1" value={duracao} onChange={(e) => setDuracao(e.target.value)} required />
          <Input label="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
          <Input label="Descrição" className="sm:col-span-2" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <Button type="submit" className="sm:col-span-2">Cadastrar serviço</Button>
        </form>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </GlassCard>

      <GlassCard title="Serviços cadastrados">
        <ul className="space-y-4">
          {servicos.map((s) => (
            <li key={s.id} className="border-b border-neon-primary/10 pb-4 text-sm">
              {editingId === s.id ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Nome" value={editNome} onChange={(e) => setEditNome(e.target.value)} />
                  <Input label="Preço" type="number" value={editPreco} onChange={(e) => setEditPreco(e.target.value)} />
                  <Input label="Duração" type="number" value={editDuracao} onChange={(e) => setEditDuracao(e.target.value)} />
                  <Input label="Categoria" value={editCategoria} onChange={(e) => setEditCategoria(e.target.value)} />
                  <div className="flex gap-2 sm:col-span-2">
                    <Button onClick={() => saveEdit(s.id)}>Salvar</Button>
                    <Button variant="ghost" onClick={() => setEditingId(null)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {s.nome}{" "}
                      <span className={s.ativo ? "text-neon-primary" : "text-text-muted"}>
                        ({s.ativo ? "ativo" : "inativo"})
                      </span>
                    </p>
                    <p className="text-text-muted">
                      {formatCurrency(Number(s.preco))} · {s.duracaoMinutos} min
                      {s.categoria ? ` · ${s.categoria}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => startEdit(s)}>Editar</Button>
                    <Button variant="ghost" onClick={() => toggleAtivo(s)}>
                      {s.ativo ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
