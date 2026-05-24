import type { Role } from "@/lib/types/enums";

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  CLIENTE: "/dashboard/cliente",
  BARBEIRO: "/dashboard/barbeiro",
  RECEPCIONISTA: "/dashboard/recepcao",
  ADMIN: "/dashboard/admin",
};

export function getDashboardPath(role: Role): string {
  return DASHBOARD_BY_ROLE[role];
}

export function isDashboardPath(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}
