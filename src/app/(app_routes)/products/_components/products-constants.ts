import type { ListProductsEnterprisesQuery } from "@/modules/products/products.schema"

export const PRODUCTS_BASE_PATH = "/products"
export const DEFAULT_PRODUCTS_LIMIT = 50
export const PRODUCTS_CLIENT_SEARCH_LIMIT = 100

export type ProductsDateFilters = {
  dateFrom?: string
  dateTo?: string
}

export type ProductsDraftFilters = {
  code: string
  description: string
  barCode: string
  status?: ListProductsEnterprisesQuery["status"]
  controlsBatch?: boolean
  manufacturer: string
}

export type ProductsInlineSearchField =
  | "code"
  | "description"
  | "barCode"
  | "manufacturer"

export function defaultProductsDateFilters(): ProductsDateFilters {
  return {}
}

export function defaultProductsDraftFilters(): ProductsDraftFilters {
  return {
    code: "",
    description: "",
    barCode: "",
    status: undefined,
    controlsBatch: undefined,
    manufacturer: "",
  }
}

export function defaultProductsEnterprisesFilters(): ListProductsEnterprisesQuery {
  return {
    limit: DEFAULT_PRODUCTS_LIMIT,
    offset: 0,
  }
}
