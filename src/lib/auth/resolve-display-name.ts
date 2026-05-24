import { getClienteMe } from "@/lib/api/cliente";
import { getBarbeiroMe } from "@/lib/api/barbeiro";
import type { Role } from "@/lib/types/enums";

export async function resolveDisplayName(role: Role): Promise<string | null> {
  if (role === "CLIENTE") {
    const c = await getClienteMe();
    return c.nome;
  }
  if (role === "BARBEIRO") {
    const b = await getBarbeiroMe();
    return b.nome;
  }
  return null;
}

export function displayNameFromEmail(email: string | null): string | null {
  if (!email) {
    return null;
  }
  const local = email.split("@")[0]?.trim();
  if (!local) {
    return null;
  }
  return local.charAt(0).toUpperCase() + local.slice(1);
}
