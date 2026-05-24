import type {
  FormaPagamento,
  StatusAgendamento,
  StatusAtraso,
  StatusFolhaComissao,
  StatusPagamento,
  TipoAlerta,
  TipoConteudoMensagem,
  TipoMidiaPublicacao,
  TipoPublicacao,
} from "./enums";

export interface ClienteResponseDTO {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  cpf?: string | null;
  dataNascimento?: string | null;
  observacoes?: string | null;
  ativo: boolean;
}

export interface ClienteUpdateDTO {
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  observacoes?: string;
}

export interface BarbeiroResponseDTO {
  id: string;
  nome: string;
  emailUsuario?: string | null;
  telefone?: string | null;
  percentualComissao?: number | null;
  especialidades?: string | null;
  ativo: boolean;
}

export interface BarbeiroUpdateDTO {
  telefone?: string;
  percentualComissao?: number;
  especialidades?: string;
}

export interface ServicoResponseDTO {
  id: string;
  nome: string;
  descricao?: string | null;
  preco: number;
  duracaoMinutos: number;
  categoria?: string | null;
  ativo: boolean;
}

export interface ServicoCreateDTO {
  nome: string;
  descricao?: string;
  preco: number;
  duracaoMinutos: number;
  categoria?: string;
}

export interface ServicoUpdateDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  duracaoMinutos?: number;
  categoria?: string;
  ativo?: boolean;
}

export interface AgendamentoCreateDTO {
  inicio: string;
  clienteId: string;
  barbeiroId: string;
  servicoId?: string;
  servicoIds?: string[];
  observacoes?: string;
}

export interface HorarioDisponivelDTO {
  inicio: string;
  fim: string;
}

export interface AgendaDisponivelResponseDTO {
  barbeiroId: string;
  data: string;
  duracaoTotalMinutos: number;
  abertura: string;
  fechamento: string;
  intervaloMinutos: number;
  horariosDisponiveis: HorarioDisponivelDTO[];
}

export interface AgendamentoPersonRef {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
}

export interface AgendamentoServicoRef {
  id: string;
  nome: string;
  descricao?: string;
}

export interface AgendamentoResponseDTO {
  id: string;
  inicio: string;
  fim: string;
  status: StatusAgendamento;
  observacoes?: string | null;
  atrasoMinutos?: number | null;
  atrasoMotivo?: string | null;
  atrasoInformadoEm?: string | null;
  atrasoStatus?: StatusAtraso | null;
  atrasoConfirmadoEm?: string | null;
  valorTotal?: number | null;
  createdAt: string;
  cliente: AgendamentoPersonRef;
  barbeiro: AgendamentoPersonRef;
  servico: AgendamentoServicoRef;
  servicos?: AgendamentoServicoRef[];
}

export interface AgendamentoAtrasoDTO {
  minutos: number;
  motivo: string;
}

export interface AtrasoMensagemCreateDTO {
  texto: string;
}

export interface AtrasoMensagemResponseDTO {
  id: string;
  agendamentoId: string;
  autorUserId: string;
  autorNome: string;
  autorRole: string;
  texto: string;
  respostaOficial: boolean;
  createdAt: string;
}

export interface AlertaResponseDTO {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: TipoAlerta;
  referenciaId?: string | null;
  lido: boolean;
  createdAt: string;
}

export interface UsuarioChatDTO {
  userId: string;
  nome: string;
  email: string;
  role: string;
}

export interface ConversaResponseDTO {
  conversaId: string;
  outroUserId: string;
  outroNome: string;
  outroEmail: string;
  outroRole: string;
  ultimaMensagemEm?: string | null;
  mensagensNaoLidas: number;
}

export interface ChatEnviarDTO {
  texto: string;
}

export interface ChatMensagemResponseDTO {
  id: string;
  conversaId: string;
  remetenteUserId: string;
  remetenteNome?: string | null;
  tipoConteudo?: TipoConteudoMensagem;
  texto?: string | null;
  anexoUrl?: string | null;
  anexoContentType?: string | null;
  anexoNome?: string | null;
  lida: boolean;
  enviadaEm: string;
}

export interface PublicacaoMidiaDTO {
  id: string;
  tipo: TipoMidiaPublicacao;
  url: string;
  contentType?: string | null;
  nomeArquivo?: string | null;
  ordem: number;
}

export interface PublicacaoResponseDTO {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: TipoPublicacao;
  imagemUrl?: string | null;
  midias?: PublicacaoMidiaDTO[];
  avaliacaoId?: string | null;
  avaliacaoNota?: number | null;
  avaliacaoComentario?: string | null;
  publicado: boolean;
  publicadoEm?: string | null;
  createdAt: string;
}

export interface PublicacaoCreateDTO {
  titulo: string;
  conteudo: string;
  tipo: TipoPublicacao;
  imagemUrl?: string;
  avaliacaoId?: string;
  publicado?: boolean;
}

export interface ContagemPorStatusDTO {
  status: StatusAgendamento;
  quantidade: number;
}

export interface RelatorioResumoDTO {
  periodoInicio: string;
  periodoFim: string;
  totalAgendamentos: number;
  porStatus: ContagemPorStatusDTO[];
  taxaConclusaoPercent: number;
  taxaCancelamentoPercent: number;
  taxaFaltaPercent: number;
}

export interface RelatorioPorBarbeiroItemDTO {
  barbeiroId: string;
  nomeBarbeiro: string;
  quantidadeAgendamentos: number;
}

export interface RelatorioPorBarbeiroDTO {
  periodoInicio: string;
  periodoFim: string;
  itens: RelatorioPorBarbeiroItemDTO[];
}

export interface RelatorioFaturamentoDTO {
  periodoInicio: string;
  periodoFim: string;
  faturamentoServicosConcluidos: number;
}

export interface StaffUserCreateDTO {
  nome: string;
  email: string;
  senha: string;
  role: "BARBEIRO" | "RECEPCIONISTA";
  telefone?: string;
  percentualComissao?: number;
  especialidades?: string;
}

export interface StaffUserResponseDTO {
  userId: string;
  barbeiroId: string | null;
  nome: string;
  email: string;
  role: "BARBEIRO" | "RECEPCIONISTA" | "ADMIN" | "CLIENTE";
  ativo: boolean;
}

export interface StaffUserSummaryDTO {
  userId: string;
  barbeiroId: string | null;
  nome: string;
  email: string;
  telefone?: string | null;
  role: "BARBEIRO" | "RECEPCIONISTA";
  ativo: boolean;
}

export interface StaffUserStatusDTO {
  ativo: boolean;
}

export interface PagamentoCreateDTO {
  agendamentoId: string;
  formaPagamento: FormaPagamento;
  valor?: number;
  confirmarImediato?: boolean;
  observacao?: string;
}

export interface PagamentoResponseDTO {
  id: string;
  agendamentoId: string;
  formaPagamento: FormaPagamento;
  valor: number;
  status: StatusPagamento;
  pixChave?: string | null;
  pixCopiaCola?: string | null;
  pixQrCodeUrl?: string | null;
  comprovanteEnviado?: boolean;
  comprovanteEnviadoEm?: string | null;
  dataPagamento?: string | null;
  observacao?: string | null;
  createdAt: string;
}

export interface FolhaComissaoResponseDTO {
  id: string;
  barbeiroId: string;
  barbeiroNome: string;
  anoMes: string;
  status: StatusFolhaComissao;
  valorTotal: number;
  quantidadeAtendimentos: number;
  pagoEm?: string | null;
  updatedAt: string;
}

export interface FolhaComissaoStatusDTO {
  status: StatusFolhaComissao;
}

export interface RelatorioCompletoItemServico {
  servicoId: string;
  servicoNome: string;
  quantidade: number;
}

export interface RelatorioCompletoItemBarbeiro {
  barbeiroId: string;
  barbeiroNome: string;
  total: number;
  concluidos: number;
  cancelados: number;
  faltas: number;
}

export interface RelatorioCompletoItemBarbeiroStatus {
  barbeiroId: string;
  barbeiroNome: string;
  status: StatusAgendamento;
  quantidade: number;
}

export interface RelatorioFolhaComissaoItemDTO {
  folhaId: string;
  barbeiroId: string;
  barbeiroNome: string;
  anoMes: string;
  status: StatusFolhaComissao;
  valorTotal: number;
  quantidadeAtendimentos: number;
  pagoEm: string | null;
}

export interface RelatorioCompletoDTO {
  inicio: string;
  fim: string;
  totalAgendamentos: number;
  cortesConcluidos: number;
  cancelados: number;
  faltas: number;
  emAndamento: number;
  agendadosConfirmados: number;
  atrasosInformados: number;
  faturamentoConcluidos: number;
  pagamentosPendentes: number;
  pagamentosPagos: number;
  totalComissoesPeriodo: number;
  comissaoAPagar: number;
  comissaoEmAndamento: number;
  comissaoPago: number;
  folhasComissao: RelatorioFolhaComissaoItemDTO[];
  porStatus: ContagemPorStatusDTO[];
  porServico: RelatorioCompletoItemServico[];
  porBarbeiro: RelatorioCompletoItemBarbeiro[];
  barbeiroPorStatus: RelatorioCompletoItemBarbeiroStatus[];
}

export interface AvaliacaoCreateDTO {
  agendamentoId: string;
  nota: number;
  comentario?: string;
}

export interface AvaliacaoResponseDTO {
  id: string;
  agendamentoId: string;
  nota: number;
  comentario?: string | null;
  nomeCliente: string;
  createdAt: string;
}

export interface AvaliacoesBarbeiroDTO {
  barbeiroId: string;
  nomeBarbeiro: string;
  mediaNotas: number | null;
  totalAvaliacoes: number;
  itens: AvaliacaoResponseDTO[];
}

export interface JwtPayload {
  sub: string;
  exp?: number;
  iat?: number;
}
