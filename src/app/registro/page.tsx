"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatAuthError } from "@/contexts/AuthContext";
import { register } from "@/lib/auth/auth-api";
import { isApiError } from "@/lib/api/errors";
import { phoneValidationMessage } from "@/lib/utils/validation";

export default function RegistroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const phoneErr = phoneValidationMessage(telefone);
    if (phoneErr) {
      setFieldErrors({ telefone: phoneErr });
      return;
    }
    setLoading(true);

    try {
      await register({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        role: "CLIENTE",
        telefone: telefone.trim() || undefined,
      });
      router.push("/login?registered=1");
    } catch (err) {
      if (isApiError(err) && err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Criar conta"
      subtitle="Cadastro de cliente — barbeiros e recepção são criados pelo administrador"
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/login" className="text-neon-primary hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome"
          name="nome"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          error={fieldErrors.nome}
        />
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <Input
          label="Telefone (10 ou 11 dígitos, opcional)"
          name="telefone"
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          error={fieldErrors.telefone}
        />
        <Input
          label="Senha"
          name="senha"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          error={fieldErrors.senha}
        />

        {error && (
          <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Cadastrando…" : "Cadastrar como cliente"}
        </Button>
      </form>
    </AuthCard>
  );
}
