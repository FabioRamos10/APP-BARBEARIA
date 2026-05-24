"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { GlassCard } from "@/components/ui/GlassCard";
import { getClienteMe, updateClienteMe } from "@/lib/api/cliente";
import { formatAuthError } from "@/contexts/AuthContext";
import {
  cpfValidationMessage,
  phoneValidationMessage,
} from "@/lib/utils/validation";

export function ClientePerfilForm() {
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getClienteMe()
      .then((c) => {
        setNome(c.nome);
        setEmail(c.email);
        setTelefone(c.telefone ?? "");
        setCpf(c.cpf ?? "");
        setDataNascimento(c.dataNascimento ?? "");
        setObservacoes(c.observacoes ?? "");
      })
      .catch((e) => setError(formatAuthError(e)))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErr = phoneValidationMessage(telefone);
    const cpfErr = cpfValidationMessage(cpf);
    if (phoneErr || cpfErr) {
      setError(phoneErr ?? cpfErr ?? null);
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateClienteMe({
        telefone: telefone || undefined,
        cpf: cpf || undefined,
        dataNascimento: dataNascimento || undefined,
        observacoes: observacoes || undefined,
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
    <GlassCard title="Meu perfil" subtitle={`${nome} · ${email}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Telefone (10 ou 11 dígitos)"
          name="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <Input
          label="CPF (11 dígitos)"
          name="cpf"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
        <Input
          label="Data de nascimento"
          name="dataNascimento"
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
        />
        <Textarea
          label="Observações"
          name="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
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
