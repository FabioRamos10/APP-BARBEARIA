/** Formata resposta do chatbot (markdown leve) para exibição segura */
export function formatChatMessage(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong class=\"text-neon-primary\">$1</strong>")
    .replace(/\n/g, "<br />");
}
