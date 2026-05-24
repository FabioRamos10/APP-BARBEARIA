import type { Role } from "@/lib/types/enums";
import {
  ADMIN_NAV,
  BARBEIRO_NAV,
  CLIENTE_NAV,
  RECEPCAO_NAV,
  type NavItem,
} from "@/lib/navigation/dashboard-nav";

const MENSAGENS: NavItem = {
  href: "/dashboard/mensagens",
  label: "Mensagens",
};

export function getNavForRole(role: Role | null): NavItem[] {
  switch (role) {
    case "ADMIN":
      return [...ADMIN_NAV, MENSAGENS];
    case "RECEPCIONISTA":
      return [...RECEPCAO_NAV, MENSAGENS];
    case "BARBEIRO":
      return [...BARBEIRO_NAV, MENSAGENS];
    case "CLIENTE":
      return [...CLIENTE_NAV, MENSAGENS];
    default:
      return [MENSAGENS];
  }
}
