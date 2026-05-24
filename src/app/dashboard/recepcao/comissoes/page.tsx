"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { ComissoesPanel } from "@/components/comissoes/ComissoesPanel";
import { RECEPCAO_NAV } from "@/lib/navigation/dashboard-nav";

export default function RecepcaoComissoesPage() {
  return (
    <RoleGuard allowed={["RECEPCIONISTA", "ADMIN"]}>
    <RoleDashboardLayout
      title="Comissões"
      subtitle="Folhas por barbeiro e mês"
      nav={RECEPCAO_NAV}
    >
      <ComissoesPanel readOnlyStatus />
    </RoleDashboardLayout>
    </RoleGuard>
  );
}
