"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface PageLoaderProps {
  visible: boolean;
}

export function PageLoader({ visible }: PageLoaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!visible || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-bg-deep/55 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-label="Carregando"
    >
      <div className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
        <span
          className="absolute inset-0 rounded-full border-2 border-neon-primary/15"
          aria-hidden
        />
        <span
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-neon-primary border-r-neon-primary/40 shadow-[0_0_28px_rgba(0,255,156,0.45)]"
          aria-hidden
        />
        <span
          className="h-2.5 w-2.5 rounded-full bg-neon-primary shadow-[0_0_12px_rgba(0,255,156,0.9)]"
          aria-hidden
        />
      </div>
    </div>,
    document.body,
  );
}

/** Usado em loading.tsx do App Router */
export function PageLoaderInline() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center py-16">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-neon-primary/15" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-neon-primary border-r-neon-primary/40 shadow-[0_0_28px_rgba(0,255,156,0.45)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-neon-primary shadow-[0_0_12px_rgba(0,255,156,0.9)]" />
      </div>
    </div>
  );
}
