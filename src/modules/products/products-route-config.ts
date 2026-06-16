import {
  PRODUCTS_BASE_PATH,
  defaultProductsEnterprisesFilters,
} from "@/app/(app_routes)/products/_components/products-constants"
import type { PaginationQuery } from "@/modules/products/products-query"
import type { ListProductsEnterprisesQuery } from "@/modules/products/products.schema"

export type ProductsListVariant = "products" | "promotional-prices"

export type ProductsListRouteConfig = {
  variant: ProductsListVariant
  basePath: string
  defaultListFilters: () => ListProductsEnterprisesQuery | PaginationQuery
  labels: {
    singular: string
    plural: string
    loadingList: string
    loadListError: string
    loadListErrorTitle: string
    emptyList: string
    emptyListHint: string
    loadingDetail: string
    loadDetailError: string
    loadDetailErrorTitle: string
    invalidIdTitle: string
    invalidIdDescription: string
    staleDetailTitle: string
  }
  list: {
    filtersFormId: string
  }
}

export const PRODUCTS_ROUTE_CONFIG: ProductsListRouteConfig = {
  variant: "products",
  basePath: PRODUCTS_BASE_PATH,
  defaultListFilters: defaultProductsEnterprisesFilters,
  labels: {
    singular: "produto",
    plural: "produtos",
    loadingList: "A carregar produtos",
    loadListError: "Não foi possível carregar os produtos.",
    loadListErrorTitle: "Erro ao carregar produtos",
    emptyList: "Nenhum produto encontrado",
    emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
    loadingDetail: "A carregar produto",
    loadDetailError: "Não foi possível carregar o produto.",
    loadDetailErrorTitle: "Erro ao carregar produto",
    invalidIdTitle: "Identificador inválido",
    invalidIdDescription: "O ID do produto não é válido.",
    staleDetailTitle: "Não foi possível atualizar os dados.",
  },
  list: {
    filtersFormId: "products-filters-form",
  },
}

export const PROMOTIONAL_PRICES_ROUTE_CONFIG: ProductsListRouteConfig = {
  variant: "promotional-prices",
  basePath: "/products/promotional-prices",
  defaultListFilters: () => ({ limit: 50, offset: 0 }),
  labels: {
    singular: "preço promocional",
    plural: "preços promocionais",
    loadingList: "A carregar preços promocionais",
    loadListError: "Não foi possível carregar os preços promocionais.",
    loadListErrorTitle: "Erro ao carregar preços promocionais",
    emptyList: "Nenhum preço promocional encontrado",
    emptyListHint: "Não há promoções cadastradas para esta empresa.",
    loadingDetail: "A carregar preço promocional",
    loadDetailError: "Não foi possível carregar o preço promocional.",
    loadDetailErrorTitle: "Erro ao carregar preço promocional",
    invalidIdTitle: "Identificador inválido",
    invalidIdDescription: "O ID informado não é válido.",
    staleDetailTitle: "Não foi possível atualizar os dados.",
  },
  list: {
    filtersFormId: "promotional-prices-filters-form",
  },
}
