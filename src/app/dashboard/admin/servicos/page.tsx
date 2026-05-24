"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { ServicosAdmin } from "@/components/admin/ServicosAdmin";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { ADMIN_NAV } from "@/lib/navigation/dashboard-nav";

export default function AdminServicosPage() {
  return (
    <RoleGuard allowed={["ADMIN"]}>
      <RoleDashboardLayout
        title="Administração"
        subtitle="Serviços"
        nav={ADMIN_NAV}
      >
        <ServicosAdmin />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
