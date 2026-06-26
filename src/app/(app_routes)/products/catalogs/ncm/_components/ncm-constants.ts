import type { ListProductsNcmQuery } from "@/modules/products/products-catalogs.schema"

export type NcmDraftFilters = {
  ncm: string
  description: string
}

export function defaultNcmDraftFilters(): NcmDraftFilters {
  return { ncm: "", description: "" }
}

export function defaultNcmFilters(): ListProductsNcmQuery {
  return { limit: 50, offset: 0 }
}

export const NCM_LABELS = {
  singular: "NCM",
  plural: "NCM",
  loadListError: "Não foi possível carregar os códigos NCM.",
  loadListErrorTitle: "Erro ao carregar NCM",
  emptyList: "Nenhum código NCM encontrado",
  emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
} as const
