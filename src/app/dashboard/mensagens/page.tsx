"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { RoleDashboardLayout } from "@/components/layout/RoleDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getNavForRole } from "@/lib/navigation/get-nav-for-role";

export default function MensagensPage() {
  const { role } = useAuth();
  const nav = getNavForRole(role);

  return (
    <RoleGuard
      allowed={["ADMIN", "RECEPCIONISTA", "BARBEIRO", "CLIENTE"]}
    >
      <RoleDashboardLayout
        title="Mensagens"
        subtitle="Chat em tempo real com a equipe"
        nav={nav}
      >
        <ChatPanel />
      </RoleDashboardLayout>
    </RoleGuard>
  );
}
