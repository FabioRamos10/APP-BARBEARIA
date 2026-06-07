"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { BrandReveal } from "@/components/brand/BrandReveal";
import { HomeLink } from "@/components/ui/HomeLink";
import { GlassCard } from "@/components/ui/GlassCard";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  const [cardReady, setCardReady] = useState(false);

  return (
    <AppShell centered>
      <div className="flex w-full max-w-md flex-col items-center">
        <BrandReveal
          variant="hero"
          className="mb-8 text-2xl sm:text-3xl"
          onComplete={() => setCardReady(true)}
        />
        <div
          className={[
            "intro-content-reveal intro-content-reveal-hero w-full",
            cardReady ? "intro-content-reveal-visible" : "",
          ].join(" ")}
        >
          <GlassCard title={title} subtitle={subtitle} className="w-full">
            {children}
            {footer && (
              <div className="mt-6 border-t border-neon-primary/10 pt-4 text-center text-sm text-text-muted">
                {footer}
              </div>
            )}
          </GlassCard>
          <div className="relative z-10 mt-8 flex justify-center">
            <HomeLink compact />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
