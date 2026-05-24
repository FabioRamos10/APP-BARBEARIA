"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { login as loginApi } from "@/lib/auth/auth-api";
import { logout as logoutSession } from "@/lib/auth/logout";
import { getDashboardPath } from "@/lib/auth/redirect";
import { resolveRole } from "@/lib/auth/resolve-role";
import {
  displayNameFromEmail,
  resolveDisplayName,
} from "@/lib/auth/resolve-display-name";
import {
  clearSessionMeta,
  getStoredDisplayName,
  getStoredEmail,
  getStoredRole,
  setStoredDisplayName,
  setStoredEmail,
  setStoredRole,
} from "@/lib/auth/session-store";
import { getSubjectFromToken, isTokenExpired } from "@/lib/auth/session";
import { clearToken, getToken, setToken } from "@/lib/auth/token";
import type { Role } from "@/lib/types/enums";
import { isApiError } from "@/lib/api/errors";

interface AuthContextValue {
  email: string | null;
  displayName: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function resolveNameForRole(
  role: Role,
  email: string | null,
): Promise<string | null> {
  const cached = getStoredDisplayName();
  if (cached) {
    return cached;
  }
  try {
    const fromApi = await resolveDisplayName(role);
    if (fromApi) {
      setStoredDisplayName(fromApi);
      return fromApi;
    }
  } catch {
    /* fallback abaixo */
  }
  return displayNameFromEmail(email);
}

async function loadSession(): Promise<{
  email: string | null;
  displayName: string | null;
  role: Role | null;
}> {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    clearToken();
    clearSessionMeta();
    return { email: null, displayName: null, role: null };
  }

  const subject = getSubjectFromToken(token);
  const email = getStoredEmail() ?? subject;

  const cachedRole = getStoredRole();
  if (cachedRole) {
    const displayName = await resolveNameForRole(cachedRole, email);
    return { email, displayName, role: cachedRole };
  }

  try {
    const resolved = await resolveRole();
    setStoredRole(resolved);
    const displayName = await resolveNameForRole(resolved, email);
    return { email, displayName, role: resolved };
  } catch {
    clearToken();
    clearSessionMeta();
    return { email: null, displayName: null, role: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback(async () => {
    const session = await loadSession();
    setEmail(session.email);
    setDisplayName(session.displayName);
    setRole(session.role);
    return session;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void applySession().finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [applySession]);

  const login = useCallback(
    async (loginEmail: string, senha: string) => {
      const { token } = await loginApi({ email: loginEmail, senha });
      setToken(token);
      setStoredEmail(loginEmail);

      const resolvedRole = await resolveRole();
      setStoredRole(resolvedRole);
      setEmail(loginEmail);
      setRole(resolvedRole);
      const name = await resolveNameForRole(resolvedRole, loginEmail);
      setDisplayName(name);

      router.replace(getDashboardPath(resolvedRole));
    },
    [router],
  );

  const logout = useCallback(() => {
    logoutSession();
    setEmail(null);
    setDisplayName(null);
    setRole(null);
    router.replace("/login");
  }, [router]);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    await applySession();
    setIsLoading(false);
  }, [applySession]);

  const value = useMemo(
    () => ({
      email,
      displayName,
      role,
      isAuthenticated: Boolean(getToken()) && Boolean(role),
      isLoading,
      login,
      logout,
      refreshSession,
    }),
    [email, displayName, role, isLoading, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}

export function formatAuthError(error: unknown): string {
  if (isApiError(error)) {
    if (error.fieldErrors) {
      return Object.values(error.fieldErrors).join(" ");
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocorreu um erro inesperado.";
}
