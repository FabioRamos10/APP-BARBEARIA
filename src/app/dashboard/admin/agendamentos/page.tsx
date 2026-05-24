"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { AgendamentoList } from "@/components/agendamentos/AgendamentoList";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { ADMIN_NAV } from "@/lib/navigation/dashboard-nav";

export default function AdminAgendamentosPage() {
  return (
    <RoleGuard allowed={["ADMIN"]}>
      <RoleDashboardLayout
        title="Administração"
        subtitle="Todos os agendamentos"
        nav={ADMIN_NAV}
      >
        <AgendamentoList mode="all" allowStatusChange="staff" allowCancel />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
