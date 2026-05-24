import type { Role } from "@/lib/types/enums";
import type { JwtPayload } from "@/lib/types/dto";

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const json = base64UrlDecode(parts[1]);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** JWT do backend não inclui role; use session-store após login. */
export function getRoleFromToken(): Role | null {
  return null;
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }
  return Date.now() >= payload.exp * 1000;
}

export function getSubjectFromToken(token: string): string | null {
  return decodeJwtPayload(token)?.sub ?? null;
}
