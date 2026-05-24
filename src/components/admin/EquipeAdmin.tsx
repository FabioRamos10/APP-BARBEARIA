"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  createStaffUser,
  listStaffUsers,
  updateStaffUserStatus,
} from "@/lib/api/admin";
import { formatAuthError } from "@/contexts/AuthContext";
import type { StaffUserSummaryDTO } from "@/lib/types/dto";
import type { StaffCreateRole } from "@/lib/types/enums";
import { roleLabel } from "@/lib/auth/roles";
import { phoneValidationMessage } from "@/lib/utils/validation";

export function EquipeAdmin() {
  const [equipe, setEquipe] = useState<StaffUserSummaryDTO[]>([]);
  const [role, setRole] = useState<StaffCreateRole>("BARBEIRO");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [comissao, setComissao] = useState("");
  const [especialidades, setEspecialidades] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setEquipe(await listStaffUsers());
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
    setSuccess(null);

    const phoneErr = phoneValidationMessage(telefone);
    if (phoneErr) {
      setError(phoneErr);
      return;
    }

    try {
      const created = await createStaffUser({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        role,
        telefone: telefone.trim() || undefined,
        percentualComissao:
          role === "BARBEIRO" && comissao ? Number(comissao) : undefined,
        especialidades:
          role === "BARBEIRO" && especialidades.trim()
            ? especialidades.trim()
            : undefined,
      });
      setSuccess(
        `${roleLabel(created.role)} criado: ${created.email}. O usuário já pode fazer login.`,
      );
      setNome("");
      setEmail("");
      setSenha("");
      setTelefone("");
      setComissao("");
      setEspecialidades("");
      await load();
    } catch (err) {
      setError(formatAuthError(err));
    }
  };

  const handleToggleStatus = async (member: StaffUserSummaryDTO) => {
    setTogglingId(member.userId);
    setError(null);
    try {
      await updateStaffUserStatus(member.userId, { ativo: !member.ativo });
      await load();
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard title="Nova conta da equipe">
        <p className="mb-4 text-xs text-text-muted">
          Apenas administradores podem criar barbeiros e recepcionistas com login.
          O cadastro público é somente para clientes.
        </p>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {(["BARBEIRO", "RECEPCIONISTA"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={[
                  "rounded-lg border px-3 py-2 text-sm transition-all",
                  role === r
                    ? "border-neon-primary bg-neon-primary/10 text-neon-primary"
                    : "border-neon-primary/20 text-text-muted hover:border-neon-primary/40",
                ].join(" ")}
              >
                {roleLabel(r)}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <Input
              label="E-mail (login)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha inicial"
              type="password"
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="sm:col-span-2"
            />
            <Input
              label="Telefone (10 ou 11 dígitos)"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required={role === "BARBEIRO"}
            />
            {role === "BARBEIRO" && (
              <>
                <Input
                  label="Comissão (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={comissao}
                  onChange={(e) => setComissao(e.target.value)}
                />
                <Input
                  label="Especialidades"
                  className="sm:col-span-2"
                  value={especialidades}
                  onChange={(e) => setEspecialidades(e.target.value)}
                  placeholder="Corte, barba…"
                />
              </>
            )}
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
          {success && (
            <p className="text-sm text-neon-primary">{success}</p>
          )}

          <Button type="submit">Criar usuário</Button>
        </form>
      </GlassCard>

      <GlassCard title="Equipe cadastrada">
        <ul className="space-y-3 text-sm">
          {equipe.length === 0 && (
            <li className="text-text-muted">Nenhum membro cadastrado.</li>
          )}
          {equipe.map((m) => (
            <li
              key={m.userId}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-neon-primary/10 py-3"
            >
              <div>
                <p className="font-medium">
                  {m.nome}{" "}
                  <span className="text-xs text-text-muted">
                    ({roleLabel(m.role)})
                  </span>
                </p>
                <p className="text-text-muted">
                  {m.email}
                  {m.telefone ? ` · ${m.telefone}` : ""}
                </p>
                <p
                  className={
                    m.ativo ? "text-neon-primary" : "text-text-muted"
                  }
                >
                  {m.ativo ? "Ativo" : "Inativo"}
                </p>
              </div>
              <Button
                variant="ghost"
                disabled={togglingId === m.userId}
                onClick={() => void handleToggleStatus(m)}
              >
                {m.ativo ? "Desativar" : "Ativar"}
              </Button>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}