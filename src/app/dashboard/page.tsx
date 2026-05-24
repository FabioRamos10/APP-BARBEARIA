"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/auth/redirect";

export default function DashboardIndexPage() {
  const { role, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated || !role) {
      router.replace("/login");
      return;
    }
    router.replace(getDashboardPath(role));
  }, [isAuthenticated, isLoading, role, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-text-muted">
      Redirecionando…
    </div>
  );
}
