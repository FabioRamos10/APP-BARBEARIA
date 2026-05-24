"use client";

import { useMemo, useState } from "react";
import { AuthenticatedMedia } from "@/components/media/AuthenticatedMedia";
import {
  MediaViewerModal,
  type MediaViewerItem,
} from "@/components/media/MediaViewerModal";
import type { PublicacaoResponseDTO } from "@/lib/types/dto";
import { isImagemMidia, isPdfMidia } from "@/lib/utils/media-type";

function collectMidias(publicacao: PublicacaoResponseDTO): MediaViewerItem[] {
  const items: MediaViewerItem[] = [];
  const seen = new Set<string>();

  const add = (item: MediaViewerItem) => {
    if (!item.url?.trim() || seen.has(item.url)) return;
    seen.add(item.url);
    items.push(item);
  };

  if (publicacao.imagemUrl) {
    add({
      id: `capa-${publicacao.id}`,
      url: publicacao.imagemUrl,
      contentType: "image/*",
      nomeArquivo: "Capa",
    });
  }

  for (const m of publicacao.midias ?? []) {
    add({
      id: m.id,
      url: m.url,
      contentType: m.contentType,
      nomeArquivo: m.nomeArquivo,
    });
  }

  return items;
}

type Props = {
  publicacao: PublicacaoResponseDTO;
  /** Capa em destaque acima do texto */
  showCapa?: boolean;
  /** Visualização menor (lista admin) */
  compact?: boolean;
};

export function PublicacaoMidias({
  publicacao,
  showCapa = true,
  compact = false,
}: Props) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const midias = useMemo(() => collectMidias(publicacao), [publicacao]);

  const capa = midias[0]?.url === publicacao.imagemUrl ? midias[0] : null;
  const galeria = midias.filter((m) => m.id !== capa?.id);

  const openAt = (item: MediaViewerItem) => {
    const idx = midias.findIndex((x) => x.id === item.id);
    setViewerIndex(idx >= 0 ? idx : 0);
  };

  if (midias.length === 0) return null;

  return (
    <>
      {showCapa && capa && (
        <MediaThumb
          item={capa}
          variant={compact ? "tile" : "hero"}
          compact={compact}
          alt={publicacao.titulo}
          onOpen={() => openAt(capa)}
        />
      )}

      {galeria.length > 0 && (
        <div
          className={[
            "grid grid-cols-2 gap-2 sm:grid-cols-3",
            showCapa && capa ? "mt-3" : "mt-3",
          ].join(" ")}
        >
          {galeria.map((m) => (
            <MediaThumb
              key={m.id}
              item={m}
              variant="tile"
              compact={compact}
              alt=""
              onOpen={() => openAt(m)}
            />
          ))}
        </div>
      )}

      {viewerIndex !== null && (
        <MediaViewerModal
          items={midias}
          index={viewerIndex}
          publicAccess
          onClose={() => setViewerIndex(null)}
          onIndexChange={setViewerIndex}
        />
      )}
    </>
  );
}

function MediaThumb({
  item,
  variant,
  compact = false,
  alt,
  onOpen,
}: {
  item: MediaViewerItem;
  variant: "hero" | "tile";
  compact?: boolean;
  alt: string;
  onOpen: () => void;
}) {
  const label = item.nomeArquivo?.trim() || "Anexo";
  const isImage = isImagemMidia(item.contentType, item.url);
  const isPdf = isPdfMidia(item.contentType, item.url);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        "group relative w-full overflow-hidden rounded-lg border border-neon-primary/15 text-left",
        "transition hover:border-neon-primary/50 hover:shadow-[0_0_20px_rgba(0,255,156,0.15)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary",
        variant === "hero" ? "mt-3 block" : "aspect-[4/3]",
      ].join(" ")}
      aria-label={
        isImage
          ? `Ampliar imagem: ${label}`
          : isPdf
            ? `Abrir PDF: ${label}`
            : `Abrir arquivo: ${label}`
      }
    >
      {isImage ? (
        <AuthenticatedMedia
          url={item.url}
          publicAccess
          alt={alt || label}
          className={[
            "w-full object-cover transition duration-200 group-hover:scale-[1.02]",
            variant === "hero"
              ? compact
                ? "max-h-32"
                : "max-h-80"
              : "h-full min-h-[7rem]",
          ].join(" ")}
        />
      ) : (
        <div className="flex h-full min-h-[7rem] flex-col items-center justify-center gap-2 bg-black/40 p-4">
          <span className="text-3xl" aria-hidden>
            {isPdf ? "📄" : "📎"}
          </span>
          <span className="line-clamp-2 text-center text-xs text-neon-primary">
            {label}
          </span>
          <span className="text-[10px] text-text-muted group-hover:text-neon-primary">
            Clique para {isPdf ? "ler" : "abrir"}
          </span>
        </div>
      )}
      <span
        className={[
          "pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-neon-primary opacity-0 transition group-hover:opacity-100",
          isImage ? "" : "hidden sm:flex",
        ].join(" ")}
        aria-hidden
      >
        {isImage ? "Ver em tela cheia" : ""}
      </span>
    </button>
  );
}
