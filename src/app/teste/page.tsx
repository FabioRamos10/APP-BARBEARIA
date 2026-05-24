"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiFetch, ApiError } from "@/lib/api/client";
import {
  clearToken,
  getToken,
  hasToken,
  setToken,
} from "@/lib/auth/token";
import { getSubjectFromToken, isTokenExpired } from "@/lib/auth/session";
import { getStoredRole } from "@/lib/auth/session-store";
import { roleLabel } from "@/lib/auth/roles";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

type CheckStatus = "idle" | "loading" | "ok" | "error";

interface CheckResult {
  status: CheckStatus;
  message: string;
}

/** JWT mock (não válido no backend; só para cookie/middleware local) */
const MOCK_JWT =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0ZUBiYXJiZWFyaWEuY29tIiwicm9sZSI6IkNMSUVOVEUiLCJleHAiOjIwMDAwMDAwMDB9.mock";

export default function TesteFase1Page() {
  const [proxyCheck, setProxyCheck] = useState<CheckResult>({
    status: "idle",
    message: "Aguardando teste de conexão com a API.",
  });
  const [tokenInfo, setTokenInfo] = useState<string>("Sem token");

  const refreshTokenInfo = useCallback(() => {
    const token = getToken();
    if (!token) {
      setTokenInfo("Sem token no localStorage/cookie");
      return;
    }
    const role = getStoredRole();
    setTokenInfo(
      [
        `Subject: ${getSubjectFromToken(token) ?? "—"}`,
        `Role: ${role ? roleLabel(role) : "—"}`,
        `Expirado: ${isTokenExpired(token) ? "sim" : "não"}`,
      ].join(" · "),
    );
  }, []);

  const testApiProxy = async () => {
    setProxyCheck({ status: "loading", message: "Conectando…" });
    try {
      await apiFetch<void>("/auth/login", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({
          email: "nao-existe@teste.local",
          senha: "senha-invalida",
        }),
      });
      setProxyCheck({
        status: "ok",
        message: "Resposta inesperada (esperávamos erro 4xx).",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        const reachable = error.status === 401 || error.status === 400;
        setProxyCheck({
          status: reachable ? "ok" : "error",
          message: reachable
            ? `API alcançável via proxy (${error.status}: ${error.message})`
            : `Erro ${error.status}: ${error.message}`,
        });
      } else {
        setProxyCheck({
          status: "error",
          message:
            "Falha de rede. Backend em http://localhost:8080? Rode: mvn spring-boot:run",
        });
      }
    }
  };

  const simulateToken = () => {
    setToken(MOCK_JWT);
    refreshTokenInfo();
  };

  const clearSession = () => {
    clearToken();
    refreshTokenInfo();
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div>
          <Link
            href="/"
            className="text-sm text-text-muted hover:text-neon-primary"
          >
            ← Início
          </Link>
          <h1 className="font-display mt-4 text-2xl font-bold tracking-wide neon-text">
            Testes — Fase 1
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Valide tema, starfield, cliente HTTP, token e proxy antes da Fase 2.
          </p>
        </div>

        <GlassCard title="Design system">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <p className="mt-4 text-xs text-text-muted">
            Fundo estelar ativo · glass panel · paleta preto + verde neon
          </p>
        </GlassCard>

        <GlassCard title="Proxy API" subtitle="POST /auth/login (credenciais inválidas)">
          <p className="mb-4 text-sm text-text-muted">{proxyCheck.message}</p>
          <Button
            onClick={testApiProxy}
            disabled={proxyCheck.status === "loading"}
          >
            {proxyCheck.status === "loading" ? "Testando…" : "Testar conexão"}
          </Button>
          <p
            className={`mt-3 text-xs ${
              proxyCheck.status === "ok"
                ? "text-neon-primary"
                : proxyCheck.status === "error"
                  ? "text-danger"
                  : "text-text-muted"
            }`}
          >
            {proxyCheck.status === "ok" && "✓ "}
            {proxyCheck.status === "error" && "✗ "}
            Base: {process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api-backend"}
          </p>
        </GlassCard>

        <GlassCard title="Auth (local)" subtitle="Token mock para validar middleware na Fase 2">
          <p className="mb-2 text-sm text-text-muted">{tokenInfo}</p>
          <p className="mb-4 text-xs text-text-muted">
            Cookie + localStorage: {hasToken() ? "presente" : "ausente"}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={simulateToken}>Simular token</Button>
            <Button variant="ghost" onClick={refreshTokenInfo}>
              Atualizar info
            </Button>
            <Button variant="danger" onClick={clearSession}>
              Limpar token
            </Button>
          </div>
        </GlassCard>

        <GlassCard title="Middleware">
          <p className="text-sm text-text-muted">
            Com token simulado, tente acessar uma rota protegida futura (ex.{" "}
            <code className="text-neon-primary">/app</code>). Sem token, o
            middleware redireciona para{" "}
            <code className="text-neon-primary">/login</code>.
          </p>
          <Link href="/app" className="mt-4 inline-block">
            <Button variant="ghost" className="mt-2">
              Ir para /app (protegida)
            </Button>
          </Link>
        </GlassCard>
      </div>
    </AppShell>
  );
}
