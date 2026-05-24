"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { UserIdentity } from "@/components/layout/UserIdentity";
import { AlertasBell } from "@/components/alertas/AlertasBell";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND_NAME } from "@/lib/brand";
import { displayNameFromEmail } from "@/lib/auth/resolve-display-name";

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function DashboardShell({
  title,
  subtitle,
  children,
}: DashboardShellProps) {
  const { displayName, email, role, logout } = useAuth();

  const name =
    displayName ?? displayNameFromEmail(email) ?? "Usuário";

  return (
    <AppShell>
      <header className="relative z-30 mx-auto mb-8 flex w-full max-w-4xl flex-wrap items-center justify-between gap-4 border-b border-neon-primary/15 pb-4">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-primary/70">
            {BRAND_NAME}
          </p>
          <h1 className="font-display text-xl font-semibold tracking-wide text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
          {role && <UserIdentity name={name} role={role} />}
          <Button variant="ghost" onClick={logout}>
            Sair
          </Button>
          <AlertasBell />
        </div>
      </header>
      <main className="relative z-0 mx-auto w-full max-w-4xl">{children}</main>
      <footer className="relative z-10 mx-auto mt-12 w-full max-w-4xl text-center">
        <Link href="/" className="text-xs text-text-muted hover:text-neon-primary">
          Início
        </Link>
      </footer>
      <ChatbotWidget />
    </AppShell>
  );
}
