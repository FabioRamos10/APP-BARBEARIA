import { apiFetch, apiFetchMultipart } from "@/lib/api/client";
import type {
  ChatEnviarDTO,
  ChatMensagemResponseDTO,
  ConversaResponseDTO,
  UsuarioChatDTO,
} from "@/lib/types/dto";

export function listChatUsuarios() {
  return apiFetch<UsuarioChatDTO[]>("/chat/usuarios");
}

export function listConversas() {
  return apiFetch<ConversaResponseDTO[]>("/chat/conversas");
}

export function abrirConversa(outroUserId: string) {
  return apiFetch<ConversaResponseDTO>(`/chat/conversas/${outroUserId}`, {
    method: "POST",
  });
}

export function listMensagensChat(conversaId: string) {
  return apiFetch<ChatMensagemResponseDTO[]>(
    `/chat/conversas/${conversaId}/mensagens`,
  );
}

export function enviarMensagemChat(conversaId: string, dto: ChatEnviarDTO) {
  return apiFetch<ChatMensagemResponseDTO>(
    `/chat/conversas/${conversaId}/mensagens`,
    {
      method: "POST",
      body: JSON.stringify(dto),
    },
  );
}

export function enviarMensagemComAnexo(
  conversaId: string,
  texto: string | undefined,
  arquivo: File,
) {
  const form = new FormData();
  if (texto?.trim()) form.append("texto", texto.trim());
  form.append("arquivo", arquivo);
  return apiFetchMultipart<ChatMensagemResponseDTO>(
    `/chat/conversas/${conversaId}/mensagens/com-anexo`,
    form,
    { method: "POST" },
  );
}

export function marcarConversaLida(conversaId: string) {
  return apiFetch<void>(`/chat/conversas/${conversaId}/lidas`, {
    method: "PATCH",
  });
}
