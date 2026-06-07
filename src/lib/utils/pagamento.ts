import type { FormaPagamento, StatusPagamento } from "@/lib/types/enums";

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  DINHEIRO: "Dinheiro",
  CARTAO_CREDITO: "Cartão de crédito",
  CARTAO_DEBITO: "Cartão de débito",
  PIX: "PIX",
};

/** Rótulos legados (não aparecem no cadastro) */
const FORMA_PAGAMENTO_LEGADO: Record<string, string> = {
  TRANSFERENCIA: "Transferência",
};

export function formaPagamentoLabel(forma: string): string {
  return (
    FORMA_PAGAMENTO_LABELS[forma as FormaPagamento] ??
    FORMA_PAGAMENTO_LEGADO[forma] ??
    forma
  );
}

export const STATUS_PAGAMENTO_LABELS: Record<StatusPagamento, string> = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  CANCELADO: "Cancelado",
  REEMBOLSADO: "Reembolsado",
};
