"use client";

import { useCallback, useEffect } from "react";
import { AuthenticatedMedia } from "@/components/media/AuthenticatedMedia";
import { isImagemMidia, isPdfMidia } from "@/lib/utils/media-type";
import { resolvePublicMediaSrc } from "@/lib/utils/media-url";

export type MediaViewerItem = {
  id: string;
  url: string;
  contentType?: string | null;
  nomeArquivo?: string | null;
};

type Props = {
  items: MediaViewerItem[];
  index: number;
  publicAccess?: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function MediaViewerModal({
  items,
  index,
  publicAccess = true,
  onClose,
  onIndexChange,
}: Props) {
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onIndexChange(index - 1);
  }, [hasPrev, index, onIndexChange]);

  const goNext = useCallback(() => {
    if (hasNext) onIndexChange(index + 1);
  }, [hasNext, index, onIndexChange]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [item, onClose, goPrev, goNext]);

  if (!item) return null;

  const label = item.nomeArquivo?.trim() || "Anexo";
  const isImage = isImagemMidia(item.contentType, item.url);
  const isPdf = isPdfMidia(item.contentType, item.url);
  const pdfSrc = publicAccess ? resolvePublicMediaSrc(item.url) : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={isImage ? "Visualizar imagem" : isPdf ? "Visualizar PDF" : label}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-neon-primary/30 bg-bg-surface shadow-[0_0_40px_rgba(0,255,156,0.12)]">
        <div className="flex items-center justify-between gap-3 border-b border-neon-primary/15 px-4 py-3">
          <p className="min-w-0 truncate text-sm font-medium text-text-primary">
            {label}
            {items.length > 1 && (
              <span className="ml-2 text-text-muted">
                ({index + 1}/{items.length})
              </span>
            )}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {isPdf && pdfSrc && (
              <a
                href={pdfSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neon-primary underline hover:text-neon-bright"
              >
                Abrir em nova aba
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2.5 py-1 text-lg leading-none text-text-muted transition hover:bg-white/10 hover:text-text-primary"
              aria-label="Fechar visualizador"
            >
              ×
            </button>
          </div>
        </div>

        <div className="relative flex min-h-[12rem] flex-1 items-center justify-center overflow-auto bg-black/40 p-4">
          {items.length > 1 && (
            <>
              <button
                type="button"
                disabled={!hasPrev}
                onClick={goPrev}
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-neon-primary/30 bg-black/70 px-3 py-2 text-sm text-neon-primary transition hover:bg-neon-primary/20 disabled:pointer-events-none disabled:opacity-30"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                disabled={!hasNext}
                onClick={goNext}
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-neon-primary/30 bg-black/70 px-3 py-2 text-sm text-neon-primary transition hover:bg-neon-primary/20 disabled:pointer-events-none disabled:opacity-30"
                aria-label="Próximo"
              >
                ›
              </button>
            </>
          )}

          {isImage && (
            <AuthenticatedMedia
              url={item.url}
              publicAccess={publicAccess}
              alt={label}
              className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
            />
          )}

          {isPdf && pdfSrc && (
            <iframe
              title={label}
              src={pdfSrc}
              className="h-[75vh] w-full rounded-lg border border-white/10 bg-white"
            />
          )}

          {!isImage && !isPdf && (
            <AuthenticatedMedia
              url={item.url}
              publicAccess={publicAccess}
              asDownload
              label={`Baixar ${label}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
