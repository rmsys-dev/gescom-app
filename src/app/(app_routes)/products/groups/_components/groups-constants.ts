import type { ListProductGroupsQuery } from "@/modules/products/products-catalogs.schema"

export type GroupsDraftFilters = {
  description: string
}

export function defaultGroupsDraftFilters(): GroupsDraftFilters {
  return { description: "" }
}

export function defaultGroupsFilters(): ListProductGroupsQuery {
  return { limit: 50, offset: 0 }
}

export const GROUPS_LABELS = {
  singular: "grupo",
  plural: "grupos",
  loadListError: "Não foi possível carregar os grupos.",
  loadListErrorTitle: "Erro ao carregar grupos",
  emptyList: "Nenhum grupo encontrado",
  emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
} as const
