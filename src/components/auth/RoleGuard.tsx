"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/auth/redirect";
import type { Role } from "@/lib/types/enums";

interface RoleGuardProps {
  allowed: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const { role, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (role && !allowed.includes(role)) {
      router.replace(getDashboardPath(role));
    }
  }, [allowed, isAuthenticated, isLoading, role, router]);

  if (isLoading || !role || !allowed.includes(role)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-text-muted">
        Carregando…
      </div>
    );
  }

  return <>{children}</>;
}
