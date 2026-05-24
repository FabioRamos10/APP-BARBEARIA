export function isImagemMidia(
  contentType?: string | null,
  url?: string,
): boolean {
  if (contentType?.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url ?? "");
}

export function isPdfMidia(
  contentType?: string | null,
  url?: string,
): boolean {
  if (contentType === "application/pdf") return true;
  return /\.pdf(\?|$)/i.test(url ?? "");
}
