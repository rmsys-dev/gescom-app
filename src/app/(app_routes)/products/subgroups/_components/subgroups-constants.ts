import type { ListProductSubgroupsQuery } from "@/modules/products/products-catalogs.schema"

export type SubgroupsDraftFilters = {
  description: string
}

export function defaultSubgroupsDraftFilters(): SubgroupsDraftFilters {
  return { description: "" }
}

export function defaultSubgroupsFilters(): ListProductSubgroupsQuery {
  return { limit: 50, offset: 0 }
}

export const SUBGROUPS_LABELS = {
  singular: "subgrupo",
  plural: "subgrupos",
  loadListError: "Não foi possível carregar os subgrupos.",
  loadListErrorTitle: "Erro ao carregar subgrupos",
  emptyList: "Nenhum subgrupo encontrado",
  emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
} as const
