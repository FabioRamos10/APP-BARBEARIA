export interface NavItem {
  href: string;
  label: string;
  /** Rótulo curto no mobile (scroll horizontal) */
  shortLabel?: string;
}

export const CLIENTE_NAV: NavItem[] = [
  { href: "/dashboard/cliente/agendamentos", label: "Meus agendamentos", shortLabel: "Agenda" },
  { href: "/dashboard/cliente/agendar", label: "Agendar" },
  { href: "/dashboard/cliente/perfil", label: "Perfil" },
];

export const BARBEIRO_NAV: NavItem[] = [
  { href: "/dashboard/barbeiro", label: "Minha agenda", shortLabel: "Agenda" },
  { href: "/dashboard/barbeiro/comissoes", label: "Comissões" },
  { href: "/dashboard/barbeiro/perfil", label: "Perfil" },
];

export const RECEPCAO_NAV: NavItem[] = [
  { href: "/dashboard/recepcao/agendamentos", label: "Agendamentos", shortLabel: "Agenda" },
  { href: "/dashboard/recepcao/novo", label: "Novo agendamento", shortLabel: "Novo" },
  { href: "/dashboard/recepcao/clientes", label: "Clientes" },
  { href: "/dashboard/recepcao/comissoes", label: "Comissões" },
  { href: "/dashboard/recepcao/relatorios", label: "Relatórios" },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard/admin/agendamentos", label: "Agendamentos", shortLabel: "Agenda" },
  { href: "/dashboard/admin/novo", label: "Novo agendamento", shortLabel: "Novo" },
  { href: "/dashboard/admin/servicos", label: "Serviços" },
  { href: "/dashboard/admin/barbeiros", label: "Equipe" },
  { href: "/dashboard/admin/clientes", label: "Clientes" },
  { href: "/dashboard/admin/comissoes", label: "Comissões" },
  { href: "/dashboard/admin/relatorios", label: "Relatórios" },
  { href: "/dashboard/admin/sobre-nos", label: "Sobre nós", shortLabel: "Sobre" },
];
