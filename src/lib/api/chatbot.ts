import { apiFetch } from "@/lib/api/client";

export interface ChatbotRequestDTO {
  mensagem: string;
}

export interface ChatbotResponseDTO {
  resposta: string;
  categoria: string;
  confianca: number;
  sugestoes: string[];
}

export function sendChatbotMessage(mensagem: string) {
  return apiFetch<ChatbotResponseDTO>("/chatbot/mensagem", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ mensagem }),
  });
}
