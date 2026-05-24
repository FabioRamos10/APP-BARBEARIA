"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { RelatorioPanel } from "@/components/relatorios/RelatorioPanel";
import { RECEPCAO_NAV } from "@/lib/navigation/dashboard-nav";

export default function RecepcaoRelatoriosPage() {
  return (
    <RoleGuard allowed={["RECEPCIONISTA"]}>
      <RoleDashboardLayout
        title="Recepção"
        subtitle="Relatórios"
        nav={RECEPCAO_NAV}
      >
        <RelatorioPanel />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
