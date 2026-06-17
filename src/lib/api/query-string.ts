import type { PaginationQuery } from "@/lib/schemas/pagination"

type QueryParamsInput = PaginationQuery & {
  search?: string
  status?: string
  code?: number
  barCode?: string
  manufacturer?: string
  controlsBatch?: boolean
  dateFrom?: string
  dateTo?: string
}

export function buildQueryString(
  entries: Record<string, string | number | boolean | undefined>
): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value))
    }
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export function buildPaginationQuery(query: QueryParamsInput): string {
  return buildQueryString({
    limit: query.limit,
    offset: query.offset,
    search:
      query.search !== undefined && query.search.length > 0
        ? query.search
        : undefined,
    status: query.status,
    code: query.code,
    barCode: query.barCode,
    manufacturer: query.manufacturer,
    controlsBatch: query.controlsBatch,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  })
}
