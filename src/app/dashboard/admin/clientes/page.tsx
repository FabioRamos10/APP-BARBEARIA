"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { listClientes } from "@/lib/api/cliente";
import { ADMIN_NAV } from "@/lib/navigation/dashboard-nav";
import { formatAuthError } from "@/contexts/AuthContext";
import type { ClienteResponseDTO } from "@/lib/types/dto";

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<ClienteResponseDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listClientes()
      .then(setClientes)
      .catch((e) => setError(formatAuthError(e)));
  }, []);

  return (
    <RoleGuard allowed={["ADMIN"]}>
      <RoleDashboardLayout
        title="Administração"
        subtitle="Clientes"
        nav={ADMIN_NAV}
      >
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        <ul className="space-y-3">
          {clientes.map((c) => (
            <li key={c.id}>
              <GlassCard>
                <p className="font-medium">{c.nome}</p>
                <p className="text-sm text-text-muted">{c.email}</p>
              </GlassCard>
            </li>
          ))}
        </ul>
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
