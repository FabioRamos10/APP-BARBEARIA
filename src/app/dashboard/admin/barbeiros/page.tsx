"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { EquipeAdmin } from "@/components/admin/EquipeAdmin";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { ADMIN_NAV } from "@/lib/navigation/dashboard-nav";

export default function AdminEquipePage() {
  return (
    <RoleGuard allowed={["ADMIN"]}>
      <RoleDashboardLayout
        title="Administração"
        subtitle="Equipe — barbeiros e recepcionistas"
        nav={ADMIN_NAV}
      >
        <EquipeAdmin />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
