import { MEMBER_FILTER_FIELDS } from "@/app/(app_routes)/members/_components/members-constants"
import {
  CLIENT_MEMBER_CLASS,
  isClienteClass,
} from "@/modules/memberships/memberships-rules"
import type {
  EnterpriseMemberClass,
  ListMembersQuery,
} from "@/modules/memberships/memberships.schema"

export type MembershipListVariant = "members" | "clients"

export type MembershipRouteConfig = {
  variant: MembershipListVariant
  basePath: "/members" | "/clients"
  defaultListFilters: ListMembersQuery
  labels: {
    singular: string
    plural: string
    listTitle: string
    listSubtitle: string
    searchTitle: string
    searchLabel: string
    searchingTitle: string
    idleTitle: string
    idleHint: string
    loadListError: string
    loadListErrorTitle: string
    emptyList: string
    emptyListHint: string
    detailTitle: string
    detailDescription: string
    loadDetailError: string
    loadDetailErrorTitle: string
    notFoundTitle: string
    notFoundWrongClass: string
  }
  list: {
    filtersFormId: string
    showClassColumn: boolean
    filterFields: typeof MEMBER_FILTER_FIELDS
  }
  actions: {
    primary: { label: string; icon: "UserPlus" }
    secondary: {
      label: string
      icon: "Send" | "Link2"
      type: "invite" | "link"
    }
  }
  detail: {
    paramKey: "memberId" | "clientId"
    validateClass?: (cls: EnterpriseMemberClass) => boolean
    lockClass: boolean
    redirectAfterDelete: string
    showDepartments: boolean
  }
}

export const MEMBERS_ROUTE_CONFIG: MembershipRouteConfig = {
  variant: "members",
  basePath: "/members",
  defaultListFilters: {
    class: undefined,
    userId: undefined,
    offset: 0,
    limit: 50,
  },
  labels: {
    singular: "membro",
    plural: "membros",
    listTitle: "Membros",
    listSubtitle: "Gerencie e consulte os membros cadastrados",
    searchTitle: "Buscar membros",
    searchLabel: "Buscar membros",
    searchingTitle: "Buscando membros...",
    idleTitle: "Nenhuma busca realizada para membros",
    idleHint:
      "Clique em Buscar membros para listar os registros ou refine os filtros",
    loadListError: "Não foi possível carregar os membros.",
    loadListErrorTitle: "Erro ao carregar os membros",
    emptyList: "Nenhum membro encontrado",
    emptyListHint: "Ajuste os filtros ou adicione um novo membro.",
    detailTitle: "Membro",
    detailDescription: "Visualização rápida do membro",
    loadDetailError: "Não foi possível carregar o membro.",
    loadDetailErrorTitle: "Erro ao carregar o membro",
    notFoundTitle: "Membro não encontrado",
    notFoundWrongClass: "Este vínculo não pertence à classe esperada.",
  },
  list: {
    filtersFormId: "members-filters-form",
    showClassColumn: true,
    filterFields: MEMBER_FILTER_FIELDS,
  },
  actions: {
    primary: { label: "Adicionar membro", icon: "UserPlus" },
    secondary: { label: "Convidar membro", icon: "Send", type: "invite" },
  },
  detail: {
    paramKey: "memberId",
    lockClass: false,
    redirectAfterDelete: "/members",
    showDepartments: true,
  },
}

export const CLIENTS_ROUTE_CONFIG: MembershipRouteConfig = {
  variant: "clients",
  basePath: "/clients",
  defaultListFilters: {
    class: CLIENT_MEMBER_CLASS,
    userId: undefined,
    offset: 0,
    limit: 50,
  },
  labels: {
    singular: "cliente",
    plural: "clientes",
    listTitle: "Clientes",
    listSubtitle: "Gerencie e consulte os clientes cadastrados",
    searchTitle: "Buscar clientes",
    searchLabel: "Buscar clientes",
    searchingTitle: "Buscando clientes...",
    idleTitle: "Nenhuma busca realizada para clientes",
    idleHint:
      "Clique em Buscar clientes para listar os registros ou refine os filtros",
    loadListError: "Não foi possível carregar os clientes.",
    loadListErrorTitle: "Erro ao carregar os clientes",
    emptyList: "Nenhum cliente encontrado",
    emptyListHint: "Ajuste os filtros ou adicione um novo cliente.",
    detailTitle: "Cliente",
    detailDescription: "Visualização rápida do cliente",
    loadDetailError: "Não foi possível carregar o cliente.",
    loadDetailErrorTitle: "Erro ao carregar o cliente",
    notFoundTitle: "Cliente não encontrado",
    notFoundWrongClass: "Este vínculo não pertence à classe cliente.",
  },
  list: {
    filtersFormId: "clients-filters-form",
    showClassColumn: false,
    filterFields: MEMBER_FILTER_FIELDS,
  },
  actions: {
    primary: { label: "Adicionar cliente", icon: "UserPlus" },
    secondary: { label: "Vincular cliente", icon: "Link2", type: "link" },
  },
  detail: {
    paramKey: "clientId",
    validateClass: isClienteClass,
    lockClass: true,
    redirectAfterDelete: "/clients",
    showDepartments: false,
  },
}
