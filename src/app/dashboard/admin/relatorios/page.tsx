"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { RelatorioPanel } from "@/components/relatorios/RelatorioPanel";
import { ADMIN_NAV } from "@/lib/navigation/dashboard-nav";

export default function AdminRelatoriosPage() {
  return (
    <RoleGuard allowed={["ADMIN"]}>
      <RoleDashboardLayout
        title="Administração"
        subtitle="Relatórios"
        nav={ADMIN_NAV}
      >
        <RelatorioPanel />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
