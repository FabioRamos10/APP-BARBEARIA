"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatAuthError } from "@/contexts/AuthContext";
import { forgotPassword } from "@/lib/auth/auth-api";
import { isApiError } from "@/lib/api/errors";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await forgotPassword({ email: email.trim() });
      setSent(true);
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
      title="Recuperar senha"
      subtitle="Enviaremos instruções se o e-mail estiver cadastrado"
      footer={
        <Link href="/login" className="text-neon-primary hover:underline">
          Voltar ao login
        </Link>
      }
    >
      {sent ? (
        <p className="rounded-lg border border-neon-primary/30 bg-neon-primary/10 px-3 py-3 text-sm text-neon-primary">
          Se o e-mail existir em nossa base, você receberá um link para redefinir
          a senha em breve.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          {error && (
            <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Enviando…" : "Enviar link"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
