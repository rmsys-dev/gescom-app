import type { ListProductBrandsQuery } from "@/modules/products/products-catalogs.schema"

export type BrandsDraftFilters = {
  description: string
}

export function defaultBrandsDraftFilters(): BrandsDraftFilters {
  return { description: "" }
}

export function defaultBrandsFilters(): ListProductBrandsQuery {
  return { limit: 50, offset: 0 }
}

export const BRANDS_LABELS = {
  singular: "marca",
  plural: "marcas",
  loadListError: "Não foi possível carregar as marcas.",
  loadListErrorTitle: "Erro ao carregar marcas",
  emptyList: "Nenhuma marca encontrada",
  emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
} as const
