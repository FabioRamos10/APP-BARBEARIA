"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { ClientePerfilForm } from "@/components/perfil/ClientePerfilForm";
import { CLIENTE_NAV } from "@/lib/navigation/dashboard-nav";

export default function ClientePerfilPage() {
  return (
    <RoleGuard allowed={["CLIENTE"]}>
      <RoleDashboardLayout
        title="Área do cliente"
        subtitle="Meu perfil"
        nav={CLIENTE_NAV}
      >
        <ClientePerfilForm />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
