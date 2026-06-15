import { apiFetch } from "@/lib/api/client"
import { fetchById, fetchPaginated } from "@/lib/api/paginated-fetch"
import { parsePaginatedEnvelope, parseSuccessEnvelope } from "@/lib/api/parse-response"
import {
  buildStockMovementsQuery,
  createStockMovementRequestSchema,
  stockBatchBalanceSchema,
  stockBatchSchema,
  stockLocationSchema,
  stockMinMaxSchema,
  stockMovementSchema,
  stockSectorRentalSchema,
  stockSectorSchema,
  type CreateStockMovementRequest,
  type ListStockMovementsQuery,
  type PaginationQuery,
} from "@/modules/stock/stock.schema"

export async function listStockSectorsService(query: PaginationQuery = {}) {
  return fetchPaginated("stock-sectors", stockSectorSchema, query)
}

export async function getStockSectorService(stockSectorId: string) {
  return fetchById(`stock-sectors/${stockSectorId}`, stockSectorSchema)
}

export async function listStockLocationsService(query: PaginationQuery = {}) {
  return fetchPaginated("stock-locations", stockLocationSchema, query)
}

export async function getStockLocationService(stockLocationId: string) {
  return fetchById(`stock-locations/${stockLocationId}`, stockLocationSchema)
}

export async function listStockBatchesService(query: PaginationQuery = {}) {
  return fetchPaginated("stock-batches", stockBatchSchema, query)
}

export async function getStockBatchService(stockBatchId: string) {
  return fetchById(`stock-batches/${stockBatchId}`, stockBatchSchema)
}

export async function listStockSectorRentalsService(query: PaginationQuery = {}) {
  return fetchPaginated("stock-sectors-rental", stockSectorRentalSchema, query)
}

export async function getStockSectorRentalService(stockSectorRentalId: string) {
  return fetchById(
    `stock-sectors-rental/${stockSectorRentalId}`,
    stockSectorRentalSchema
  )
}

export async function listStockBatchBalancesService(query: PaginationQuery = {}) {
  return fetchPaginated("stock-batch-balances", stockBatchBalanceSchema, query)
}

export async function getStockBatchBalanceService(stockBatchBalanceId: string) {
  return fetchById(
    `stock-batch-balances/${stockBatchBalanceId}`,
    stockBatchBalanceSchema
  )
}

export async function listStockMinMaxService(query: PaginationQuery = {}) {
  return fetchPaginated("stock-min-max", stockMinMaxSchema, query)
}

export async function getStockMinMaxService(stockMinMaxId: string) {
  return fetchById(`stock-min-max/${stockMinMaxId}`, stockMinMaxSchema)
}

export async function listStockMovementsService(
  query: ListStockMovementsQuery = {}
) {
  const qs = buildStockMovementsQuery(query)
  const raw = await apiFetch<unknown>(`stock-movements${qs}`, { method: "GET" })
  return parsePaginatedEnvelope(raw, stockMovementSchema, "GET /stock-movements")
}

export async function getStockMovementService(stockMovementId: string) {
  return fetchById(`stock-movements/${stockMovementId}`, stockMovementSchema)
}

export async function createStockMovementService(
  input: CreateStockMovementRequest
) {
  const body = createStockMovementRequestSchema.parse(input)
  const raw = await apiFetch<unknown>("stock-movements", {
    method: "POST",
    body,
  })
  return parseSuccessEnvelope(raw, stockMovementSchema, "POST /stock-movements")
}
