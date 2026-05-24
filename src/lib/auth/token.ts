const TOKEN_STORAGE_KEY = "barbearia_token";
export const TOKEN_COOKIE_NAME = "barbearia_token";

/** 2h — aligned with backend JWT expiry */
const TOKEN_MAX_AGE_SECONDS = 7200;

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  const secure =
    window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function hasToken(): boolean {
  return Boolean(getToken());
}
