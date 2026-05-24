"use client";

import { useEffect, useState } from "react";
import { apiFetchBlob } from "@/lib/api/client";
import { mediaPathFromUrl, resolvePublicMediaSrc } from "@/lib/utils/media-url";

type Props = {
  url: string;
  /** Mídia pública (publicações) — sem Authorization. */
  publicAccess?: boolean;
  alt?: string;
  className?: string;
  /** Exibe link de download em vez de imagem embutida. */
  asDownload?: boolean;
  label?: string;
};

export function AuthenticatedMedia({
  url,
  publicAccess = false,
  alt = "",
  className = "",
  asDownload = false,
  label,
}: Props) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (publicAccess) {
      setObjectUrl(resolvePublicMediaSrc(url));
      return;
    }

    let revoked: string | null = null;
    const path = mediaPathFromUrl(url);

    apiFetchBlob(path)
      .then((blob) => {
        revoked = URL.createObjectURL(blob);
        setObjectUrl(revoked);
        setError(false);
      })
      .catch(() => setError(true));

    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [url, publicAccess]);

  if (error) {
    return (
      <p className="text-xs text-text-muted">
        {label ?? "Não foi possível carregar o anexo."}
      </p>
    );
  }

  if (!objectUrl) {
    return <p className="text-xs text-text-muted">Carregando…</p>;
  }

  if (asDownload) {
    return (
      <a
        href={objectUrl}
        download={label}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-neon-primary underline"
      >
        {label ?? "Baixar arquivo"}
      </a>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={objectUrl} alt={alt} className={className} />
  );
}
