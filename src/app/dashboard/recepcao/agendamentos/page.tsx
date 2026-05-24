"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { AgendamentoList } from "@/components/agendamentos/AgendamentoList";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { RECEPCAO_NAV } from "@/lib/navigation/dashboard-nav";

export default function RecepcaoAgendamentosPage() {
  return (
    <RoleGuard allowed={["RECEPCIONISTA"]}>
      <RoleDashboardLayout
        title="Recepção"
        subtitle="Todos os agendamentos"
        nav={RECEPCAO_NAV}
      >
        <AgendamentoList mode="all" allowStatusChange="staff" allowCancel />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
