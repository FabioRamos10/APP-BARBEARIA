"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { ComissoesPanel } from "@/components/comissoes/ComissoesPanel";
import { BARBEIRO_NAV } from "@/lib/navigation/dashboard-nav";

export default function BarbeiroComissoesPage() {
  return (
    <RoleGuard allowed={["BARBEIRO"]}>
    <RoleDashboardLayout
      title="Minhas comissões"
      subtitle="Valores acumulados por mês"
      nav={BARBEIRO_NAV}
    >
      <ComissoesPanel readOnlyStatus />
    </RoleDashboardLayout>
    </RoleGuard>
  );
}
