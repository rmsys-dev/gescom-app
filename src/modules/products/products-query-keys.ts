import type { ListProductNbsQuery } from "@/modules/products/products-catalogs.schema"
import type { PaginationQuery } from "@/modules/products/products-query"
import type {
  ListProductsEnterprisesQuery,
  ListProductsQuery,
} from "@/modules/products/products.schema"

export const productsQueryKeys = {
  all: ["products"] as const,
  products: (enterpriseId: string, filters?: ListProductsQuery) =>
    ["products", enterpriseId, "global", filters ?? {}] as const,
  product: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "global", id] as const,
  enterprises: (enterpriseId: string, filters?: ListProductsEnterprisesQuery) =>
    ["products", enterpriseId, "enterprises", filters ?? {}] as const,
  enterprise: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "enterprises", id] as const,
  enterpriseByCode: (enterpriseId: string, code: number) =>
    ["products", enterpriseId, "enterprises", "code", code] as const,
  prices: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "prices", filters ?? {}] as const,
  price: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "prices", id] as const,
  promotionalPrices: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "promotional-prices", filters ?? {}] as const,
  promotionalPrice: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "promotional-prices", id] as const,
  taxation: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "taxation", filters ?? {}] as const,
  taxationItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "taxation", id] as const,
  applications: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "applications", filters ?? {}] as const,
  application: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "applications", id] as const,
  units: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "units", filters ?? {}] as const,
  unit: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "units", id] as const,
  types: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "types", filters ?? {}] as const,
  type: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "types", id] as const,
  ncm: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "ncm", filters ?? {}] as const,
  ncmItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "ncm", id] as const,
  cest: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "cest", filters ?? {}] as const,
  cestItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "cest", id] as const,
  anp: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "anp", filters ?? {}] as const,
  anpItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "anp", id] as const,
  nbs: (enterpriseId: string, filters?: ListProductNbsQuery) =>
    ["products", enterpriseId, "catalogs", "nbs", filters ?? {}] as const,
  nbsItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "nbs", id] as const,
  icms: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "icms", filters ?? {}] as const,
  icmsItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "icms", id] as const,
  groups: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "groups", filters ?? {}] as const,
  group: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "groups", id] as const,
  subgroups: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "subgroups", filters ?? {}] as const,
  subgroup: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "subgroups", id] as const,
  brands: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "brands", filters ?? {}] as const,
  brand: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "brands", id] as const,
  pisCofins: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "pis-cofins", filters ?? {}] as const,
  pisCofinsItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "pis-cofins", id] as const,
}
