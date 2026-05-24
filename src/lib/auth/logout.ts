import { clearToken } from "@/lib/auth/token";
import { clearSessionMeta } from "@/lib/auth/session-store";

export function logout(): void {
  clearToken();
  clearSessionMeta();
}
