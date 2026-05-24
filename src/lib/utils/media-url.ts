import { getBaseUrl } from "@/lib/api/client";

/** Path relativo à API, ex.: /media/chat/{id}/arquivo.jpg */
export function mediaPathFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

/** URL utilizável no browser (proxy /api-backend em dev). */
export function resolvePublicMediaSrc(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  const path = mediaPathFromUrl(url.trim());
  if (!path.startsWith("/media/")) return url.trim();
  const base = getBaseUrl().replace(/\/$/, "");
  return `${base}${path}`;
}
