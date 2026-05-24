import type { ReactNode } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <AppShell centered>
      <GlassCard title={title} subtitle={subtitle} className="w-full max-w-md">
        {children}
        {footer && (
          <div className="mt-6 border-t border-neon-primary/10 pt-4 text-center text-sm text-text-muted">
            {footer}
          </div>
        )}
      </GlassCard>
      <Link
        href="/"
        className="relative z-10 mt-6 text-sm text-text-muted hover:text-neon-primary"
      >
        ← Voltar ao início
      </Link>
    </AppShell>
  );
}
