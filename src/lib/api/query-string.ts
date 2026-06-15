import type { PaginationQuery } from "@/lib/schemas/pagination"

type QueryParamsInput = PaginationQuery & {
  search?: string
  status?: string
}

export function buildQueryString(
  entries: Record<string, string | number | undefined>
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
  })
}
