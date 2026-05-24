/** Converte valor de input datetime-local para LocalDateTime da API */
export function toApiDateTime(datetimeLocal: string): string {
  if (!datetimeLocal) {
    return "";
  }
  return datetimeLocal.length === 16 ? `${datetimeLocal}:00` : datetimeLocal;
}

/** Valor mínimo para datetime-local (agora + 5 min, arredondado) */
export function minDateTimeLocal(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 5);
  return toDateTimeLocalValue(d);
}

export function toDateTimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Período padrão: últimos 30 dias (yyyy-MM-dd) */
export function defaultReportRange(): { inicio: string; fim: string } {
  const fim = new Date();
  const inicio = new Date();
  inicio.setDate(inicio.getDate() - 30);
  return {
    inicio: toDateOnly(inicio),
    fim: toDateOnly(fim),
  };
}

export function toDateOnly(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function minDateOnly(): string {
  return toDateOnly(new Date());
}

/** Hora curta (pt-BR) a partir de ISO LocalDateTime da API */
export function formatTimeFromIso(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Hora curta a partir de LocalTime da API (ex.: "08:00:00") */
export function formatTimeFromLocalTime(time: string): string {
  const [h, m] = time.split(":");
  return `${h}:${m}`;
}

/** Data longa a partir de yyyy-MM-dd */
export function formatDateFromYmd(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(y, m - 1, d));
}

export function hourFromIso(iso: string): number {
  const match = iso.match(/T(\d{2}):/);
  return match ? Number(match[1]) : 0;
}
