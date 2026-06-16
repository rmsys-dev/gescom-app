import { apiFetch } from "@/lib/api/client"
import { parseSuccessEnvelope } from "@/lib/api/parse-response"
import {
  cepSchema,
  listCepsResponseSchema,
  listCitiesResponseSchema,
  listCountriesResponseSchema,
  listStatesResponseSchema,
  type Cep,
  type City,
  type Country,
  type State,
} from "@/modules/addresses/addresses.schema"

const GEO_PAGE_SIZE = 100
const CITIES_PAGE_SIZE = 200
const CEPS_PAGE_SIZE = 100
const GEO_MAX_PAGES = 20

export type ListCepsQuery = {
  cityId?: string
  cepNumber?: string
  limit?: number
  offset?: number
}

async function fetchAllGeoPages<T>(
  fetchPage: (offset: number, limit: number) => Promise<T[]>,
  pageSize: number
): Promise<T[]> {
  const allItems: T[] = []
  let offset = 0

  for (let page = 0; page < GEO_MAX_PAGES; page += 1) {
    const items = await fetchPage(offset, pageSize)
    allItems.push(...items)
    if (items.length < pageSize) break
    offset += pageSize
  }

  return allItems
}

async function listCountriesPage(offset: number, limit: number): Promise<Country[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })
  const raw = await apiFetch<unknown>(
    `addresses/countries?${params.toString()}`,
    { method: "GET" }
  )
  return parseSuccessEnvelope(
    raw,
    listCountriesResponseSchema,
    "GET /addresses/countries"
  )
}

export async function listCountriesService() {
  return fetchAllGeoPages(listCountriesPage, GEO_PAGE_SIZE)
}

async function listStatesPage(
  countryId: string,
  offset: number,
  limit: number
): Promise<State[]> {
  const params = new URLSearchParams({
    countryId,
    limit: String(limit),
    offset: String(offset),
  })
  const raw = await apiFetch<unknown>(
    `addresses/states?${params.toString()}`,
    { method: "GET" }
  )
  return parseSuccessEnvelope(
    raw,
    listStatesResponseSchema,
    "GET /addresses/states"
  )
}

export async function listStatesService(countryId: string) {
  return fetchAllGeoPages(
    (offset, limit) => listStatesPage(countryId, offset, limit),
    GEO_PAGE_SIZE
  )
}

async function listCitiesPage(
  stateId: string,
  offset: number,
  limit: number
): Promise<City[]> {
  const params = new URLSearchParams({
    stateId,
    limit: String(limit),
    offset: String(offset),
  })
  const raw = await apiFetch<unknown>(
    `addresses/cities?${params.toString()}`,
    { method: "GET" }
  )
  return parseSuccessEnvelope(
    raw,
    listCitiesResponseSchema,
    "GET /addresses/cities"
  )
}

export async function listCitiesService(stateId: string) {
  return fetchAllGeoPages(
    (offset, limit) => listCitiesPage(stateId, offset, limit),
    CITIES_PAGE_SIZE
  )
}

async function listCepsPage(query: ListCepsQuery): Promise<Cep[]> {
  const params = new URLSearchParams()
  if (query.cityId) params.set("cityId", query.cityId)
  const digits = query.cepNumber?.replace(/\D/g, "") ?? ""
  if (digits.length > 0) {
    if (digits.length !== 8) {
      throw new Error("CEP deve conter exatamente 8 digitos.")
    }
    params.set("cepNumber", digits)
  }
  if (!query.cityId && digits.length === 0) {
    throw new Error("Informe cityId ou cepNumber para listar CEPs.")
  }
  if (query.limit !== undefined) params.set("limit", String(query.limit))
  if (query.offset !== undefined) params.set("offset", String(query.offset))

  const raw = await apiFetch<unknown>(
    `addresses/ceps?${params.toString()}`,
    { method: "GET" }
  )
  return parseSuccessEnvelope(raw, listCepsResponseSchema, "GET /addresses/ceps")
}

export async function listCepsService(query: ListCepsQuery) {
  const digits = query.cepNumber?.replace(/\D/g, "") ?? ""
  if (digits.length === 8 && !query.cityId) {
    return listCepsPage({ ...query, cepNumber: digits })
  }

  return fetchAllGeoPages(
    (offset, limit) =>
      listCepsPage({
        ...query,
        cepNumber: digits || undefined,
        limit,
        offset,
      }),
    CEPS_PAGE_SIZE
  )
}

/** Resolve um CEP por ID sem baixar a lista completa da cidade. */
export async function getCepByIdService(cepId: string) {
  const raw = await apiFetch<unknown>(`addresses/ceps/${cepId}`, {
    method: "GET",
  })
  return parseSuccessEnvelope(raw, cepSchema, `GET /addresses/ceps/${cepId}`)
}
