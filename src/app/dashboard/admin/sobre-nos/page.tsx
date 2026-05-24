"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { SobreNosAdmin } from "@/components/sobre-nos/SobreNosAdmin";
import { ADMIN_NAV } from "@/lib/navigation/dashboard-nav";

export default function AdminSobreNosPage() {
  return (
    <RoleGuard allowed={["ADMIN"]}>
      <RoleDashboardLayout
        title="Sobre nós"
        subtitle="Publicações do jornal da barbearia"
        nav={ADMIN_NAV}
      >
        <SobreNosAdmin />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
