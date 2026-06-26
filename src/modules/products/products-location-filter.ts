import { fetchAllPages } from "@/lib/api/fetch-all-pages"
import {
  listStockBatchBalancesService,
  listStockBatchesService,
  listStockLocationsService,
  listStockSectorRentalsService,
} from "@/modules/stock/stock.service"
import {
  getStockLocationCode,
  type StockBatch,
  type StockBatchBalance,
  type StockLocation,
  type StockSectorRental,
} from "@/modules/stock/stock.schema"

const STOCK_FETCH_PAGE_SIZE = 100
const STOCK_FETCH_MAX_PAGES = 50

export type LocationProductIdsResult = {
  productIds: string[]
  matchedLocationCount: number
}

export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
}

export function getStockLocationSearchText(location: StockLocation): string {
  const code = getStockLocationCode(location)
  const description = String(location.description ?? "").trim()
  return normalizeSearchText(`${code} ${description}`.trim())
}

export function matchStockLocationByTerm(
  location: StockLocation,
  term: string
): boolean {
  const normalizedTerm = normalizeSearchText(term)
  if (!normalizedTerm) return false

  const haystack = getStockLocationSearchText(location)
  if (haystack.includes(normalizedTerm)) return true

  const id = location.id.toLowerCase()
  if (normalizedTerm.length >= 8 && id.startsWith(normalizedTerm)) {
    return true
  }

  return false
}

export function filterStockLocationsByTerm(
  locations: StockLocation[],
  term: string
): StockLocation[] {
  return locations.filter((location) => matchStockLocationByTerm(location, term))
}

export function collectProductIdsForLocations(
  locationIds: Set<string>,
  rentals: StockSectorRental[],
  batchBalances: StockBatchBalance[],
  batches: StockBatch[]
): string[] {
  const productIds = new Set<string>()

  for (const rental of rentals) {
    if (!locationIds.has(rental.stockLocationId)) continue
    productIds.add(rental.productsEnterprisesId)
  }

  const batchToProduct = new Map(
    batches.map((batch) => [batch.id, batch.productsEnterprisesId])
  )

  for (const balance of batchBalances) {
    if (!locationIds.has(balance.stockLocationId)) continue
    const productId = batchToProduct.get(balance.stockBatchId)
    if (productId) productIds.add(productId)
  }

  return [...productIds]
}

async function fetchAllStockPages<T>(
  fetchPage: (offset: number, limit: number) => Promise<{
    items: T[]
    total: number
    limit: number
    offset: number
  }>
): Promise<T[]> {
  const { items } = await fetchAllPages({
    pageSize: STOCK_FETCH_PAGE_SIZE,
    maxPages: STOCK_FETCH_MAX_PAGES,
    fetchPage,
  })
  return items
}

async function tryFetchAllStockPages<T>(
  fetchPage: (offset: number, limit: number) => Promise<{
    items: T[]
    total: number
    limit: number
    offset: number
  }>
): Promise<T[]> {
  try {
    return await fetchAllStockPages(fetchPage)
  } catch {
    return []
  }
}

export async function resolveProductIdsByLocationTerm(
  term: string,
  options?: { signal?: AbortSignal }
): Promise<LocationProductIdsResult> {
  const normalized = term.trim()
  if (!normalized) {
    return { productIds: [], matchedLocationCount: 0 }
  }

  options?.signal?.throwIfAborted()

  const [locations, rentals, batchBalances, batches] = await Promise.all([
    fetchAllStockPages((offset, limit) =>
      listStockLocationsService({ limit, offset })
    ),
    fetchAllStockPages((offset, limit) =>
      listStockSectorRentalsService({ limit, offset })
    ),
    tryFetchAllStockPages((offset, limit) =>
      listStockBatchBalancesService({ limit, offset })
    ),
    tryFetchAllStockPages((offset, limit) =>
      listStockBatchesService({ limit, offset })
    ),
  ])

  options?.signal?.throwIfAborted()

  const matchedLocations = filterStockLocationsByTerm(locations, normalized)
  const locationIds = new Set(matchedLocations.map((location) => location.id))

  return {
    productIds: collectProductIdsForLocations(
      locationIds,
      rentals,
      batchBalances,
      batches
    ),
    matchedLocationCount: matchedLocations.length,
  }
}
