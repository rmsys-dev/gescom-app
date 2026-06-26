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
  description?: string
  code?: number
  barCode?: string
  manufacturer?: string
  origin?: string
  group?: string
  subgroup?: string
  brand?: string
  application?: string
  ncm?: string
  cest?: string
  nbs?: string
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
    description: "description" in query ? query.description : undefined,
    code: "code" in query ? query.code : undefined,
    barCode: "barCode" in query ? query.barCode : undefined,
    manufacturer: "manufacturer" in query ? query.manufacturer : undefined,
    origin: "origin" in query ? query.origin : undefined,
    group: "group" in query ? query.group : undefined,
    subgroup: "subgroup" in query ? query.subgroup : undefined,
    brand: "brand" in query ? query.brand : undefined,
    application: "application" in query ? query.application : undefined,
    ncm: "ncm" in query ? query.ncm : undefined,
    cest: "cest" in query ? query.cest : undefined,
    nbs: "nbs" in query ? query.nbs : undefined,
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
