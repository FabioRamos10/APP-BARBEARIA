export interface NavItem {
  href: string;
  label: string;
}

export const CLIENTE_NAV: NavItem[] = [
  { href: "/dashboard/cliente/agendamentos", label: "Meus agendamentos" },
  { href: "/dashboard/cliente/agendar", label: "Agendar" },
  { href: "/dashboard/cliente/perfil", label: "Perfil" },
];

export const BARBEIRO_NAV: NavItem[] = [
  { href: "/dashboard/barbeiro", label: "Minha agenda" },
  { href: "/dashboard/barbeiro/comissoes", label: "Comissões" },
  { href: "/dashboard/barbeiro/perfil", label: "Perfil" },
];

export const RECEPCAO_NAV: NavItem[] = [
  { href: "/dashboard/recepcao/agendamentos", label: "Agendamentos" },
  { href: "/dashboard/recepcao/novo", label: "Novo agendamento" },
  { href: "/dashboard/recepcao/clientes", label: "Clientes" },
  { href: "/dashboard/recepcao/comissoes", label: "Comissões" },
  { href: "/dashboard/recepcao/relatorios", label: "Relatórios" },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard/admin/agendamentos", label: "Agendamentos" },
  { href: "/dashboard/admin/novo", label: "Novo agendamento" },
  { href: "/dashboard/admin/servicos", label: "Serviços" },
  { href: "/dashboard/admin/barbeiros", label: "Equipe" },
  { href: "/dashboard/admin/clientes", label: "Clientes" },
  { href: "/dashboard/admin/comissoes", label: "Comissões" },
  { href: "/dashboard/admin/relatorios", label: "Relatórios" },
  { href: "/dashboard/admin/sobre-nos", label: "Sobre nós" },
];
