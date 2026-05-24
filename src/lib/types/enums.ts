export const ROLES = [
  "ADMIN",
  "BARBEIRO",
  "RECEPCIONISTA",
  "CLIENTE",
] as const;

export type Role = (typeof ROLES)[number];

export const STATUS_AGENDAMENTO = [
  "AGENDADO",
  "CONFIRMADO",
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "CANCELADO",
  "FALTOU",
] as const;

export type StatusAgendamento = (typeof STATUS_AGENDAMENTO)[number];

/** Perfis criáveis pelo admin em POST /admin/usuarios */
export const STAFF_CREATE_ROLES = ["BARBEIRO", "RECEPCIONISTA"] as const;

export type StaffCreateRole = (typeof STAFF_CREATE_ROLES)[number];

export const FORMAS_PAGAMENTO = [
  "DINHEIRO",
  "CARTAO_CREDITO",
  "CARTAO_DEBITO",
  "PIX",
  "TRANSFERENCIA",
] as const;

export type FormaPagamento = (typeof FORMAS_PAGAMENTO)[number];

export const STATUS_PAGAMENTO = [
  "PENDENTE",
  "PAGO",
  "CANCELADO",
  "REEMBOLSADO",
] as const;

export type StatusPagamento = (typeof STATUS_PAGAMENTO)[number];

export const STATUS_FOLHA_COMISSAO = [
  "A_PAGAR",
  "EM_ANDAMENTO",
  "PAGO",
] as const;

export type StatusFolhaComissao = (typeof STATUS_FOLHA_COMISSAO)[number];

export const STATUS_ATRASO = ["INFORMADO", "CONFIRMADO", "RECUSADO"] as const;
export type StatusAtraso = (typeof STATUS_ATRASO)[number];

export const TIPOS_ALERTA = ["ATRASO", "CHAT", "AGENDAMENTO", "GERAL"] as const;
export type TipoAlerta = (typeof TIPOS_ALERTA)[number];

export const TIPOS_PUBLICACAO = [
  "NOTICIA",
  "CONTRATACAO",
  "ELOGIO",
  "AVALIACAO_DESTAQUE",
] as const;
export type TipoPublicacao = (typeof TIPOS_PUBLICACAO)[number];

export const TIPOS_CONTEUDO_MENSAGEM = ["TEXTO", "IMAGEM", "ARQUIVO"] as const;
export type TipoConteudoMensagem = (typeof TIPOS_CONTEUDO_MENSAGEM)[number];

export const TIPOS_MIDIA_PUBLICACAO = ["CAPA", "GALERIA"] as const;
export type TipoMidiaPublicacao = (typeof TIPOS_MIDIA_PUBLICACAO)[number];
