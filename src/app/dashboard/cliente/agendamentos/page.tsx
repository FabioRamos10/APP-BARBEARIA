"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { AgendamentoList } from "@/components/agendamentos/AgendamentoList";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { getClienteMe } from "@/lib/api/cliente";
import { CLIENTE_NAV } from "@/lib/navigation/dashboard-nav";
import { formatAuthError } from "@/contexts/AuthContext";

export default function ClienteAgendamentosPage() {
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getClienteMe()
      .then((c) => setClienteId(c.id))
      .catch((e) => setError(formatAuthError(e)));
  }, []);

  return (
    <RoleGuard allowed={["CLIENTE"]}>
      <RoleDashboardLayout
        title="Área do cliente"
        subtitle="Seus agendamentos"
        nav={CLIENTE_NAV}
      >
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        {clienteId && (
          <AgendamentoList
            mode="cliente"
            entityId={clienteId}
            allowCancel
          />
        )}
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
