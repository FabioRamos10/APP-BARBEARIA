import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { Role } from "@/lib/types/enums";

async function probe(path: string): Promise<boolean> {
  try {
    await apiFetch(path);
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      return false;
    }
    throw error;
  }
}

/**
 * JWT só contém e-mail; o perfil é descoberto pelos endpoints autorizados.
 */
export async function resolveRole(): Promise<Role> {
  if (await probe("/clientes/me")) {
    return "CLIENTE";
  }
  if (await probe("/barbeiros/me")) {
    return "BARBEIRO";
  }
  if (await probe("/barbeiros")) {
    return "ADMIN";
  }
  if (await probe("/agendamentos")) {
    return "RECEPCIONISTA";
  }

  throw new ApiError(
    "Não foi possível identificar o perfil do usuário.",
    403,
  );
}
