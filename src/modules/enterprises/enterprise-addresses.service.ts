import { apiFetch } from "@/lib/api/client"
import { parseSuccessEnvelope } from "@/lib/api/parse-response"
import { z } from "zod"
import {
  createEnterpriseAddressRequestSchema,
  enterpriseAddressSchema,
  listEnterpriseAddressesQuerySchema,
  patchEnterpriseAddressRequestSchema,
  type CreateEnterpriseAddressRequest,
  type ListEnterpriseAddressesQuery,
  type PatchEnterpriseAddressRequest,
} from "@/modules/enterprises/enterprise-addresses.schema"

function addressesBase(enterpriseId: string) {
  return `enterprises/${enterpriseId}/addresses`
}

function buildAddressesQuery(query: ListEnterpriseAddressesQuery): string {
  const parsed = listEnterpriseAddressesQuerySchema.parse(query)
  if (!parsed.adressType) return ""
  const params = new URLSearchParams({ adressType: parsed.adressType })
  return `?${params.toString()}`
}

export async function listEnterpriseAddressesService(
  enterpriseId: string,
  query: ListEnterpriseAddressesQuery = {}
) {
  const raw = await apiFetch<unknown>(
    `${addressesBase(enterpriseId)}${buildAddressesQuery(query)}`,
    { method: "GET" }
  )
  return parseSuccessEnvelope(
    raw,
    z.array(enterpriseAddressSchema),
    `GET ${addressesBase(enterpriseId)}`
  )
}

export async function createEnterpriseAddressService(
  enterpriseId: string,
  input: CreateEnterpriseAddressRequest
) {
  const body = createEnterpriseAddressRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(addressesBase(enterpriseId), {
    method: "POST",
    body,
  })
  return parseSuccessEnvelope(
    raw,
    enterpriseAddressSchema,
    `POST ${addressesBase(enterpriseId)}`
  )
}

export async function patchEnterpriseAddressService(
  enterpriseId: string,
  addressId: string,
  input: PatchEnterpriseAddressRequest
) {
  const body = patchEnterpriseAddressRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${addressesBase(enterpriseId)}/${addressId}`,
    { method: "PATCH", body }
  )
  return parseSuccessEnvelope(
    raw,
    enterpriseAddressSchema,
    `PATCH ${addressesBase(enterpriseId)}/${addressId}`
  )
}
