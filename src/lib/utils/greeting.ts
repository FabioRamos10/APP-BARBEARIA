export function getTimeGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return "Bom dia";
  }
  if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  }
  return "Boa noite";
}

export function getFirstName(fullName: string | null | undefined): string {
  if (!fullName?.trim()) {
    return "visitante";
  }
  return fullName.trim().split(/\s+/)[0] ?? "visitante";
}

export function buildChatWelcome(nome: string): string {
  const greeting = getTimeGreeting();
  const first = getFirstName(nome);
  return `${greeting}, ${first}! Sou o **CB**, assistente virtual da **Old Barber Street**. Posso ajudar com agendamentos, login, perfis, horários e muito mais. Como posso ajudar?`;
}
