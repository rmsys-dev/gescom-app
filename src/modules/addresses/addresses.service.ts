import { apiFetch } from "@/lib/api/client"
import { parseSuccessEnvelope } from "@/lib/api/parse-response"
import {
  cepSchema,
  listCepsResponseSchema,
  listCitiesResponseSchema,
  listCountriesResponseSchema,
  listStatesResponseSchema,
} from "@/modules/addresses/addresses.schema"

export async function listCountriesService() {
  const raw = await apiFetch<unknown>("addresses/countries", { method: "GET" })
  return parseSuccessEnvelope(
    raw,
    listCountriesResponseSchema,
    "GET /addresses/countries"
  )
}

export async function listStatesService(countryId: string) {
  const params = new URLSearchParams({ countryId })
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

export async function listCitiesService(stateId: string) {
  const params = new URLSearchParams({ stateId })
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

export async function listCepsService(cityId: string, cepNumber?: string) {
  const params = new URLSearchParams({ cityId })
  const digits = cepNumber?.replace(/\D/g, "") ?? ""
  if (digits.length > 0 && digits.length !== 8) {
    throw new Error("CEP deve conter exatamente 8 digitos.")
  }
  if (digits.length === 8) params.set("cepNumber", digits)
  const raw = await apiFetch<unknown>(
    `addresses/ceps?${params.toString()}`,
    { method: "GET" }
  )
  return parseSuccessEnvelope(raw, listCepsResponseSchema, "GET /addresses/ceps")
}

/** Resolve um CEP por ID sem baixar a lista completa da cidade. */
export async function getCepByIdService(cepId: string) {
  const raw = await apiFetch<unknown>(`addresses/ceps/${cepId}`, {
    method: "GET",
  })
  return parseSuccessEnvelope(raw, cepSchema, `GET /addresses/ceps/${cepId}`)
}
