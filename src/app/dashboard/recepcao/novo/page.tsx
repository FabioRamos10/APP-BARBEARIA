"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { AgendamentoForm } from "@/components/agendamentos/AgendamentoForm";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { RECEPCAO_NAV } from "@/lib/navigation/dashboard-nav";

export default function RecepcaoNovoPage() {
  return (
    <RoleGuard allowed={["RECEPCIONISTA"]}>
      <RoleDashboardLayout
        title="Recepção"
        subtitle="Novo agendamento"
        nav={RECEPCAO_NAV}
      >
        <AgendamentoForm />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
