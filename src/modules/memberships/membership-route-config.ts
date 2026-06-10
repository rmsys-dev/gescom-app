import type { EnterpriseMemberClass, ListMembersQuery } from "@/modules/memberships/memberships.schema"
import { CLIENT_MEMBER_CLASS } from "@/modules/memberships/memberships-rules"

export const DEFAULT_MEMBERS_LIST_LIMIT = 50

export type MembershipRoutePermissions = {
  canCreateMemberWithUser: boolean
  canIncludeMembers: boolean
  canConsultUsers: boolean
}

export type MembershipRouteConfig = {
  basePath: string
  defaultListFilters: () => ListMembersQuery
  requiredClass?: EnterpriseMemberClass
  labels: {
    singular: string
    plural: string
    loadingRoute: string
    loadingList: string
    loadingDetail: string
    loadingForm: string
    loadListError: string
    loadListErrorTitle: string
    loadDetailError: string
    loadDetailErrorTitle: string
    invalidId: string
    notFoundByClass: string
    notFoundByClassDescription: string
    emptyList: string
    emptyListHint: string
    identifierLabel: string
    defaultDisplayName: string
    onboardingPanelTitle: string
    onboardingPanelDescription: string
    onboardingDeniedTitle: string
  }
  list: {
    showClassFilter: boolean
    showClassColumn: boolean
    filtersFormId: string
  }
  header: {
    createHref: string
    createLabel: string
    createTooltip: string
    secondaryAction?: {
      href: string
      label: string
      tooltip: string
      canShow: (perms: MembershipRoutePermissions) => boolean
    }
  }
  detail: {
    showDepartments: boolean
    showPermissions: boolean
    allowClassEdit: boolean
    linkCardTitle: string
    linkCardDescription: string
    softDeleteLabel: string
    softDeleteTitle: string
    softDeleteDescription: string
    softDeleteConfirm: string
    updateLinkError: string
    inactivateError: string
  }
  create: {
    fixedClass?: EnterpriseMemberClass
    showDepartments: boolean
    title: string
    description: string
    note?: string
    submitLabel: string
    submitPendingLabel: string
    createError: string
  }
}

function defaultMembersListFilters(): ListMembersQuery {
  return {
    limit: DEFAULT_MEMBERS_LIST_LIMIT,
    offset: 0,
  }
}

function defaultClientListFilters(): ListMembersQuery {
  return {
    class: CLIENT_MEMBER_CLASS,
    limit: DEFAULT_MEMBERS_LIST_LIMIT,
    offset: 0,
  }
}

export const MEMBERS_ROUTE_CONFIG: MembershipRouteConfig = {
  basePath: "/members",
  defaultListFilters: defaultMembersListFilters,
  labels: {
    singular: "membro",
    plural: "membros",
    loadingRoute: "A carregar membros",
    loadingList: "A carregar lista de membros",
    loadingDetail: "A carregar detalhe do membro",
    loadingForm: "A carregar formulário de membro",
    loadListError: "Não foi possível carregar os membros.",
    loadListErrorTitle: "Erro ao carregar membros",
    loadDetailError: "Não foi possível carregar o membro.",
    loadDetailErrorTitle: "Erro ao carregar o membro",
    invalidId: "Membro inválido",
    notFoundByClass: "Membro não encontrado",
    notFoundByClassDescription:
      "Este vínculo não pertence à classe esperada.",
    emptyList: "Nenhum membro encontrado",
    emptyListHint: "Ajuste os filtros ou adicione um novo membro.",
    identifierLabel: "Identificador de membro",
    defaultDisplayName: "Membro",
    onboardingPanelTitle: "Perfil do usuário",
    onboardingPanelDescription:
      "Consulte e edite informações pessoais, endereços, contatos e dados complementares do usuário.",
    onboardingDeniedTitle: "Onboarding do usuário",
  },
  list: {
    showClassFilter: true,
    showClassColumn: true,
    filtersFormId: "members-filters-form",
  },
  header: {
    createHref: "/members/new",
    createLabel: "Novo membro",
    createTooltip: "Criar membro com usuário novo",
    secondaryAction: {
      href: "/members/invite",
      label: "Convidar",
      tooltip: "Convidar usuário existente",
      canShow: (perms) => perms.canIncludeMembers,
    },
  },
  detail: {
    showDepartments: true,
    showPermissions: true,
    allowClassEdit: true,
    linkCardTitle: "Dados de vínculo",
    linkCardDescription: "Informações de vínculo do membro",
    softDeleteLabel: "Desvincular membro",
    softDeleteTitle: "Desvincular membro?",
    softDeleteDescription:
      "O membro será desvinculado da empresa e departamentos associados serão removidos.",
    softDeleteConfirm: "Desvincular",
    updateLinkError: "Não foi possível atualizar o vínculo.",
    inactivateError: "Não foi possível inativar o membro.",
  },
  create: {
    showDepartments: true,
    title: "Novo membro",
    description: "Crie um novo membro e vincule-o à empresa.",
    note: "Ao relacionar um usuário existente, o usuário receberá um e-mail de primeiro acesso para concluir o cadastro de acesso ao sistema.",
    submitLabel: "Criar membro",
    submitPendingLabel: "A criar...",
    createError: "Nao foi possivel criar o membro.",
  },
}

export const CLIENTS_ROUTE_CONFIG: MembershipRouteConfig = {
  basePath: "/clients",
  defaultListFilters: defaultClientListFilters,
  requiredClass: CLIENT_MEMBER_CLASS,
  labels: {
    singular: "cliente",
    plural: "clientes",
    loadingRoute: "A carregar clientes",
    loadingList: "A carregar lista de clientes",
    loadingDetail: "A carregar detalhe do cliente",
    loadingForm: "A carregar formulário de cliente",
    loadListError: "Não foi possível carregar os clientes.",
    loadListErrorTitle: "Erro ao carregar clientes",
    loadDetailError: "Não foi possível carregar o cliente.",
    loadDetailErrorTitle: "Erro ao carregar o cliente",
    invalidId: "Cliente inválido",
    notFoundByClass: "Cliente não encontrado",
    notFoundByClassDescription:
      "Este vínculo não pertence a um cliente (classe CLIENTE).",
    emptyList: "Nenhum cliente encontrado",
    emptyListHint: "Ajuste os filtros ou adicione um novo cliente.",
    identifierLabel: "Identificador de cliente",
    defaultDisplayName: "Cliente",
    onboardingPanelTitle: "Perfil do cliente",
    onboardingPanelDescription:
      "Consulte e edite informações pessoais, endereços, contatos e dados complementares do cliente.",
    onboardingDeniedTitle: "Onboarding do utilizador",
  },
  list: {
    showClassFilter: false,
    showClassColumn: false,
    filtersFormId: "clients-filters-form",
  },
  header: {
    createHref: "/clients/new",
    createLabel: "Novo cliente",
    createTooltip: "Criar cliente com utilizador novo",
    secondaryAction: {
      href: "/clients/link",
      label: "Vincular",
      tooltip: "Vincular utilizador existente como cliente",
      canShow: (perms) =>
        perms.canIncludeMembers && perms.canConsultUsers,
    },
  },
  detail: {
    showDepartments: false,
    showPermissions: false,
    allowClassEdit: false,
    linkCardTitle: "Vínculo",
    linkCardDescription: "Cliente na empresa",
    softDeleteLabel: "Inativar cliente",
    softDeleteTitle: "Inativar cliente?",
    softDeleteDescription:
      "O cliente será inativado e desvinculado da empresa.",
    softDeleteConfirm: "Inativar",
    updateLinkError: "Não foi possível atualizar o cliente.",
    inactivateError: "Não foi possível inativar o cliente.",
  },
  create: {
    fixedClass: CLIENT_MEMBER_CLASS,
    showDepartments: false,
    title: "Novo cliente",
    description: "Crie um novo cliente e vincule-o à empresa.",
    note: "Clientes não possuem departamentos associados nem recebem e-mails de convite.",
    submitLabel: "Criar cliente",
    submitPendingLabel: "A criar...",
    createError: "Não foi possível criar o cliente.",
  },
}
