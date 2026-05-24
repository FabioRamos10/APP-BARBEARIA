import type { Role } from "@/lib/types/enums";

export function normalizeRole(role: string): Role | null {
  const upper = role.toUpperCase().replace(/^ROLE_/, "");
  const allowed: Role[] = ["ADMIN", "BARBEIRO", "RECEPCIONISTA", "CLIENTE"];
  return allowed.includes(upper as Role) ? (upper as Role) : null;
}

export function hasRole(userRole: Role | null, allowed: Role[]): boolean {
  if (!userRole) {
    return false;
  }
  return allowed.includes(userRole);
}

export function roleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    ADMIN: "Administrador",
    BARBEIRO: "Barbeiro",
    RECEPCIONISTA: "Recepcionista",
    CLIENTE: "Cliente",
  };
  return labels[role];
}

/** Bolinha de status por perfil (header do dashboard) */
export function roleDotClass(role: Role): string {
  const classes: Record<Role, string> = {
    ADMIN: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.85)]",
    BARBEIRO: "bg-neon-primary shadow-[0_0_10px_#39ff14]",
    RECEPCIONISTA: "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.85)]",
    CLIENTE: "bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.85)]",
  };
  return classes[role];
}
