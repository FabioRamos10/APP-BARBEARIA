"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import { getBarbeiroMe, updateBarbeiroMe } from "@/lib/api/barbeiro";
import { formatAuthError } from "@/contexts/AuthContext";

export function BarbeiroPerfilForm() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [especialidades, setEspecialidades] = useState("");
  const [comissao, setComissao] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBarbeiroMe()
      .then((b) => {
        setNome(b.nome);
        setTelefone(b.telefone ?? "");
        setEspecialidades(b.especialidades ?? "");
        setComissao(
          b.percentualComissao != null ? String(b.percentualComissao) : "",
        );
      })
      .catch((e) => setError(formatAuthError(e)))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateBarbeiroMe({
        telefone: telefone || undefined,
        especialidades: especialidades || undefined,
        percentualComissao: comissao ? Number(comissao) : undefined,
      });
      setMessage("Perfil atualizado.");
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-text-muted">Carregando perfil…</p>;
  }

  return (
    <GlassCard title="Meu perfil" subtitle={nome}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Telefone"
          name="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <Input
          label="Especialidades"
          name="especialidades"
          value={especialidades}
          onChange={(e) => setEspecialidades(e.target.value)}
        />
        <Input
          label="Comissão (%)"
          name="comissao"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={comissao}
          onChange={(e) => setComissao(e.target.value)}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        {message && <p className="text-sm text-neon-primary">{message}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando…" : "Salvar"}
        </Button>
      </form>
    </GlassCard>
  );
}
