import type {
  ListStockMovementsQuery,
  PaginationQuery,
} from "@/modules/stock/stock.schema"

export const stockQueryKeys = {
  all: ["stock"] as const,
  sectors: (enterpriseId: string, filters?: PaginationQuery) =>
    ["stock", enterpriseId, "sectors", filters ?? {}] as const,
  locations: (enterpriseId: string, filters?: PaginationQuery) =>
    ["stock", enterpriseId, "locations", filters ?? {}] as const,
  batches: (enterpriseId: string, filters?: PaginationQuery) =>
    ["stock", enterpriseId, "batches", filters ?? {}] as const,
  sectorRentals: (enterpriseId: string, filters?: PaginationQuery) =>
    ["stock", enterpriseId, "sector-rentals", filters ?? {}] as const,
  batchBalances: (enterpriseId: string, filters?: PaginationQuery) =>
    ["stock", enterpriseId, "batch-balances", filters ?? {}] as const,
  minMax: (enterpriseId: string, filters?: PaginationQuery) =>
    ["stock", enterpriseId, "min-max", filters ?? {}] as const,
  movements: (enterpriseId: string, filters?: ListStockMovementsQuery) =>
    ["stock", enterpriseId, "movements", filters ?? {}] as const,
}
