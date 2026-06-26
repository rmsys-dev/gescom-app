import type { ListProductNbsQuery } from "@/modules/products/products-catalogs.schema"

export type NbsDraftFilters = {
  nbs: string
  description: string
}

export function defaultNbsDraftFilters(): NbsDraftFilters {
  return { nbs: "", description: "" }
}

export function defaultNbsFilters(): ListProductNbsQuery {
  return { limit: 50, offset: 0 }
}

export const NBS_LABELS = {
  singular: "NBS",
  plural: "NBS",
  loadListError: "Não foi possível carregar os códigos NBS.",
  loadListErrorTitle: "Erro ao carregar NBS",
  emptyList: "Nenhum código NBS encontrado",
  emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
} as const
