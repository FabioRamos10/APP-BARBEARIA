"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatAuthError, useAuth } from "@/contexts/AuthContext";
import { isApiError } from "@/lib/api/errors";

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
  const reset = searchParams.get("reset") === "1";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await login(email.trim(), senha);
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
      title="Entrar"
      subtitle="Acesse sua conta na Old Barber Street"
      footer={
        <>
          Não tem conta?{" "}
          <Link href="/registro" className="text-neon-primary hover:underline">
            Cadastre-se
          </Link>
        </>
      }
    >
      {registered && (
        <p className="mb-4 rounded-lg border border-neon-primary/30 bg-neon-primary/10 px-3 py-2 text-sm text-neon-primary">
          Cadastro realizado. Faça login para continuar.
        </p>
      )}
      {reset && (
        <p className="mb-4 rounded-lg border border-neon-primary/30 bg-neon-primary/10 px-3 py-2 text-sm text-neon-primary">
          Senha redefinida com sucesso. Faça login.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          required
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
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm">
        <Link
          href="/esqueci-senha"
          className="text-text-muted hover:text-neon-primary"
        >
          Esqueci minha senha
        </Link>
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-text-muted">
          Carregando…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
