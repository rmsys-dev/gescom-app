import type { ListProductsCestQuery } from "@/modules/products/products-catalogs.schema"

export type CestDraftFilters = {
  cest: string
  description: string
}

export function defaultCestDraftFilters(): CestDraftFilters {
  return { cest: "", description: "" }
}

export function defaultCestFilters(): ListProductsCestQuery {
  return { limit: 50, offset: 0 }
}

export const CEST_LABELS = {
  singular: "CEST",
  plural: "CEST",
  loadListError: "Não foi possível carregar os códigos CEST.",
  loadListErrorTitle: "Erro ao carregar CEST",
  emptyList: "Nenhum código CEST encontrado",
  emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
} as const
