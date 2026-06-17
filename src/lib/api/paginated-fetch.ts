import type { ZodType } from "zod"

import { apiFetch } from "@/lib/api/client"
import {
  parsePaginatedEnvelope,
  parseSuccessEnvelope,
} from "@/lib/api/parse-response"
import type { PaginationQuery } from "@/lib/schemas/pagination"
import { buildPaginationQuery } from "@/lib/api/query-string"
import { paginationQuerySchema } from "@/lib/schemas/pagination"

type FetchPaginatedQuery = PaginationQuery & {
  search?: string
  status?: string
  code?: number
  barCode?: string
  manufacturer?: string
  controlsBatch?: boolean
  dateFrom?: string
  dateTo?: string
}

export async function fetchPaginated<T>(
  path: string,
  itemSchema: ZodType<T>,
  query: FetchPaginatedQuery = {},
  label?: string
) {
  const parsed = paginationQuerySchema.parse(query)
  const qs = buildPaginationQuery({
    ...parsed,
    search: "search" in query ? query.search : undefined,
    status: "status" in query ? query.status : undefined,
    code: "code" in query ? query.code : undefined,
    barCode: "barCode" in query ? query.barCode : undefined,
    manufacturer: "manufacturer" in query ? query.manufacturer : undefined,
    controlsBatch: "controlsBatch" in query ? query.controlsBatch : undefined,
    dateFrom: "dateFrom" in query ? query.dateFrom : undefined,
    dateTo: "dateTo" in query ? query.dateTo : undefined,
  })
  const raw = await apiFetch<unknown>(`${path}${qs}`, { method: "GET" })
  return parsePaginatedEnvelope(raw, itemSchema, label ?? `GET ${path}`)
}

export async function fetchById<T>(
  path: string,
  itemSchema: ZodType<T>,
  label?: string
) {
  const raw = await apiFetch<unknown>(path, { method: "GET" })
  return parseSuccessEnvelope(raw, itemSchema, label ?? `GET ${path}`)
}
