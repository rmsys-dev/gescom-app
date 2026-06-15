import { apiFetch } from "@/lib/api/client"
import {
  parsePaginatedEnvelope,
  parseSuccessEnvelope,
} from "@/lib/api/parse-response"
import {
  buildEnterprisesQuery,
  enterpriseDetailSchema,
  enterpriseListItemSchema,
  enterpriseRecordSchema,
  updateEnterpriseRequestSchema,
  type ListEnterprisesQuery,
  type UpdateEnterpriseRequest,
} from "@/modules/enterprises/enterprises.schema"

export async function listEnterprisesService(query: ListEnterprisesQuery = {}) {
  const qs = buildEnterprisesQuery(query)
  const raw = await apiFetch<unknown>(`enterprises${qs}`, { method: "GET" })
  return parsePaginatedEnvelope(
    raw,
    enterpriseListItemSchema,
    "GET /enterprises"
  )
}

export async function getEnterpriseByIdService(enterpriseId: string) {
  const raw = await apiFetch<unknown>(`enterprises/${enterpriseId}`, {
    method: "GET",
  })
  return parseSuccessEnvelope(
    raw,
    enterpriseDetailSchema,
    `GET /enterprises/${enterpriseId}`
  )
}

export async function updateEnterpriseService(
  enterpriseId: string,
  input: UpdateEnterpriseRequest
) {
  const body = updateEnterpriseRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`enterprises/${enterpriseId}`, {
    method: "PATCH",
    body,
  })
  return parseSuccessEnvelope(
    raw,
    enterpriseRecordSchema,
    `PATCH /enterprises/${enterpriseId}`
  )
}
