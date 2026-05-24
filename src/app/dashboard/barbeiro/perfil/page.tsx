"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { BarbeiroPerfilForm } from "@/components/perfil/BarbeiroPerfilForm";
import { BARBEIRO_NAV } from "@/lib/navigation/dashboard-nav";

export default function BarbeiroPerfilPage() {
  return (
    <RoleGuard allowed={["BARBEIRO"]}>
      <RoleDashboardLayout
        title="Área do barbeiro"
        subtitle="Meu perfil"
        nav={BARBEIRO_NAV}
      >
        <BarbeiroPerfilForm />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
