import type { Role } from "@/lib/types/enums";

const ROLE_KEY = "barbearia_role";
const EMAIL_KEY = "barbearia_email";
const NAME_KEY = "barbearia_display_name";

export function getStoredRole(): Role | null {
  if (typeof window === "undefined") {
    return null;
  }
  const value = sessionStorage.getItem(ROLE_KEY);
  if (!value) {
    return null;
  }
  return value as Role;
}

export function setStoredRole(role: Role): void {
  sessionStorage.setItem(ROLE_KEY, role);
}

export function getStoredEmail(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return sessionStorage.getItem(EMAIL_KEY);
}

export function setStoredEmail(email: string): void {
  sessionStorage.setItem(EMAIL_KEY, email);
}

export function getStoredDisplayName(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return sessionStorage.getItem(NAME_KEY);
}

export function setStoredDisplayName(name: string): void {
  sessionStorage.setItem(NAME_KEY, name);
}

export function clearSessionMeta(): void {
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
  sessionStorage.removeItem(NAME_KEY);
}
