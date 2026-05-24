"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { AgendamentoForm } from "@/components/agendamentos/AgendamentoForm";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { ADMIN_NAV } from "@/lib/navigation/dashboard-nav";

export default function AdminNovoPage() {
  return (
    <RoleGuard allowed={["ADMIN"]}>
      <RoleDashboardLayout
        title="Administração"
        subtitle="Novo agendamento"
        nav={ADMIN_NAV}
      >
        <AgendamentoForm />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
