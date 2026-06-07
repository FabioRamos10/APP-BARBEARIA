"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { BrandReveal } from "@/components/brand/BrandReveal";

export function HomeIntro() {
  const [contentReady, setContentReady] = useState(false);

  return (
    <AppShell centered>
      <div className="w-full max-w-lg text-center">
        <BrandReveal
          variant="hero"
          className="text-3xl sm:text-4xl md:text-5xl"
          onComplete={() => setContentReady(true)}
        />
        <div
          className={[
            "intro-content-reveal intro-content-reveal-hero",
            contentReady ? "intro-content-reveal-visible" : "",
          ].join(" ")}
        >
          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-text-muted">
            Faça{" "}
            <Link
              href="/login"
              className="text-neon-primary underline-offset-4 hover:underline"
            >
              login
            </Link>{" "}
            ou{" "}
            <Link
              href="/registro"
              className="text-neon-primary underline-offset-4 hover:underline"
            >
              crie sua conta
            </Link>{" "}
            para começar.
          </p>
          <p className="mx-auto mt-6 text-sm">
            <Link
              href="/sobre-nos"
              className="text-neon-primary underline-offset-4 hover:underline"
            >
              Sobre nós
            </Link>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
