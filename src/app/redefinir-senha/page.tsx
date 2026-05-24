"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatAuthError } from "@/contexts/AuthContext";
import { resetPassword } from "@/lib/auth/auth-api";
import { isApiError } from "@/lib/api/errors";

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!tokenFromUrl) {
      setError("Link inválido. Solicite uma nova recuperação de senha.");
      return;
    }

    if (novaSenha !== confirmar) {
      setError("As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token: tokenFromUrl, novaSenha });
      router.push("/login?reset=1");
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
      title="Nova senha"
      subtitle="Defina sua nova senha de acesso"
      footer={
        <Link href="/login" className="text-neon-primary hover:underline">
          Voltar ao login
        </Link>
      }
    >
      {!tokenFromUrl ? (
        <p className="text-sm text-danger">
          Token ausente no link. Use o link recebido por e-mail ou{" "}
          <Link href="/esqueci-senha" className="underline">
            solicite outro
          </Link>
          .
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nova senha"
            name="novaSenha"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            error={fieldErrors.novaSenha}
          />
          <Input
            label="Confirmar senha"
            name="confirmar"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />

          {error && (
            <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Salvando…" : "Redefinir senha"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-text-muted">
          Carregando…
        </div>
      }
    >
      <RedefinirSenhaForm />
    </Suspense>
  );
}
