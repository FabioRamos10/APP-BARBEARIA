"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UserIdentity } from "@/components/layout/UserIdentity";
import { AlertasBell } from "@/components/alertas/AlertasBell";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { Button } from "@/components/ui/Button";
import { HomeLink } from "@/components/ui/HomeLink";
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
      <header className="relative z-30 mx-auto mb-6 flex w-full max-w-4xl flex-col gap-4 border-b border-neon-primary/15 pb-5 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-end justify-between gap-3">
          <div className="min-w-0 flex-1 pr-1">
            <p className="font-display text-[10px] uppercase tracking-[0.25em] text-neon-primary/70 sm:text-xs sm:tracking-[0.3em]">
              {BRAND_NAME}
            </p>
            <h1 className="font-display mt-1 text-lg font-semibold tracking-wide text-foreground sm:text-xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
            ) : (
              <p className="mt-1 text-sm text-transparent" aria-hidden>
                &nbsp;
              </p>
            )}
          </div>
          <div className="shrink-0 -translate-y-3 sm:-translate-y-4">
            <ChatbotWidget />
          </div>
        </div>
        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:shrink-0 sm:gap-3">
          {role && (
            <UserIdentity
              name={name}
              role={role}
              className="min-w-0 flex-1 sm:max-w-[14rem]"
            />
          )}
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
            <AlertasBell />
          </div>
        </div>
      </header>
      <main className="relative z-0 mx-auto w-full max-w-4xl pb-8">
        {children}
      </main>
      <footer className="relative z-10 mx-auto mt-10 flex w-full max-w-4xl justify-center pb-8 sm:mt-12">
        <HomeLink compact />
      </footer>
    </AppShell>
  );
}
