"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { ComissoesPanel } from "@/components/comissoes/ComissoesPanel";
import { ADMIN_NAV } from "@/lib/navigation/dashboard-nav";

export default function AdminComissoesPage() {
  return (
    <RoleGuard allowed={["ADMIN"]}>
    <RoleDashboardLayout
      title="Comissões"
      subtitle="Folhas por barbeiro e mês"
      nav={ADMIN_NAV}
    >
      <ComissoesPanel />
    </RoleDashboardLayout>
    </RoleGuard>
  );
}
