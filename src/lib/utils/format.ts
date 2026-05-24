export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDateTime(iso: string): string {
  const date = parseLocalDateTime(iso);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function formatDate(iso: string): string {
  const date = parseLocalDateTime(iso);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}

function parseLocalDateTime(iso: string): Date {
  if (!iso) {
    return new Date();
  }
  if (iso.endsWith("Z")) {
    return new Date(iso);
  }
  return new Date(iso);
}
