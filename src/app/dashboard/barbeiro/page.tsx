"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { AgendamentoList } from "@/components/agendamentos/AgendamentoList";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { getBarbeiroMe } from "@/lib/api/barbeiro";
import { BARBEIRO_NAV } from "@/lib/navigation/dashboard-nav";
import { formatAuthError } from "@/contexts/AuthContext";

export default function BarbeiroAgendaPage() {
  const [barbeiroId, setBarbeiroId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBarbeiroMe()
      .then((b) => setBarbeiroId(b.id))
      .catch((e) => setError(formatAuthError(e)));
  }, []);

  return (
    <RoleGuard allowed={["BARBEIRO"]}>
      <RoleDashboardLayout
        title="Área do barbeiro"
        subtitle="Minha agenda"
        nav={BARBEIRO_NAV}
      >
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        {barbeiroId && (
          <AgendamentoList
            mode="barbeiro"
            entityId={barbeiroId}
            allowStatusChange="barbeiro"
            allowCancel
          />
        )}
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
