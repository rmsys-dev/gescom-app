import { apiFetch } from "@/lib/api/client"
import { parseSuccessEnvelope } from "@/lib/api/parse-response"
import {
  financialInfoSchema,
  patchFinancialInfoRequestSchema,
  patchPersonalInfoRequestSchema,
  patchRelationshipsRequestSchema,
  patchTaxInfosRequestSchema,
  patchUserAddressRequestSchema,
  patchUserContactRequestSchema,
  personalInfoSchema,
  postFinancialInfoRequestSchema,
  postPersonalInfoRequestSchema,
  postRelationshipsRequestSchema,
  postTaxInfosRequestSchema,
  postUserAddressRequestSchema,
  postUserContactRequestSchema,
  relationshipsSchema,
  taxInfosSchema,
  userAddressSchema,
  userContactSchema,
  userDetailsResponseSchema,
  type PatchFinancialInfoRequest,
  type PatchPersonalInfoRequest,
  type PatchRelationshipsRequest,
  type PatchTaxInfosRequest,
  type PatchUserAddressRequest,
  type PatchUserContactRequest,
  type PostFinancialInfoRequest,
  type PostPersonalInfoRequest,
  type PostRelationshipsRequest,
  type PostTaxInfosRequest,
  type PostUserAddressRequest,
  type PostUserContactRequest,
} from "@/modules/users-onboarding/users-onboarding.schema"

function userOnboardingBase(enterpriseId: string, userId: string) {
  return `enterprises/${enterpriseId}/users/${userId}`
}

export async function getUserDetailsService(
  enterpriseId: string,
  userId: string
) {
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/details`,
    { method: "GET" }
  )
  return parseSuccessEnvelope(
    raw,
    userDetailsResponseSchema,
    `GET ${userOnboardingBase(enterpriseId, userId)}/details`
  )
}

export async function postPersonalInfoService(
  enterpriseId: string,
  userId: string,
  input: PostPersonalInfoRequest
) {
  const body = postPersonalInfoRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/personal-info`
  const raw = await apiFetch<unknown>(path, { method: "POST", body })
  return parseSuccessEnvelope(raw, personalInfoSchema, `POST ${path}`)
}

export async function patchPersonalInfoService(
  enterpriseId: string,
  userId: string,
  input: PatchPersonalInfoRequest
) {
  const body = patchPersonalInfoRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/personal-info`
  const raw = await apiFetch<unknown>(path, { method: "PATCH", body })
  return parseSuccessEnvelope(raw, personalInfoSchema, `PATCH ${path}`)
}

export async function postUserAddressService(
  enterpriseId: string,
  userId: string,
  input: PostUserAddressRequest
) {
  const body = postUserAddressRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/addresses`
  const raw = await apiFetch<unknown>(path, { method: "POST", body })
  return parseSuccessEnvelope(raw, userAddressSchema, `POST ${path}`)
}

export async function patchUserAddressService(
  enterpriseId: string,
  userId: string,
  addressId: string,
  input: PatchUserAddressRequest
) {
  const body = patchUserAddressRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/addresses/${addressId}`
  const raw = await apiFetch<unknown>(path, { method: "PATCH", body })
  return parseSuccessEnvelope(raw, userAddressSchema, `PATCH ${path}`)
}

export async function postUserContactService(
  enterpriseId: string,
  userId: string,
  input: PostUserContactRequest
) {
  const body = postUserContactRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/contacts`
  const raw = await apiFetch<unknown>(path, { method: "POST", body })
  return parseSuccessEnvelope(raw, userContactSchema, `POST ${path}`)
}

export async function patchUserContactService(
  enterpriseId: string,
  userId: string,
  contactId: string,
  input: PatchUserContactRequest
) {
  const body = patchUserContactRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/contacts/${contactId}`
  const raw = await apiFetch<unknown>(path, { method: "PATCH", body })
  return parseSuccessEnvelope(raw, userContactSchema, `PATCH ${path}`)
}

export async function postRelationshipsService(
  enterpriseId: string,
  userId: string,
  input: PostRelationshipsRequest
) {
  const body = postRelationshipsRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/relationships`
  const raw = await apiFetch<unknown>(path, { method: "POST", body })
  return parseSuccessEnvelope(raw, relationshipsSchema, `POST ${path}`)
}

export async function patchRelationshipsService(
  enterpriseId: string,
  userId: string,
  input: PatchRelationshipsRequest
) {
  const body = patchRelationshipsRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/relationships`
  const raw = await apiFetch<unknown>(path, { method: "PATCH", body })
  return parseSuccessEnvelope(raw, relationshipsSchema, `PATCH ${path}`)
}

export async function postTaxInfosService(
  enterpriseId: string,
  userId: string,
  input: PostTaxInfosRequest
) {
  const body = postTaxInfosRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/tax-infos`
  const raw = await apiFetch<unknown>(path, { method: "POST", body })
  return parseSuccessEnvelope(raw, taxInfosSchema, `POST ${path}`)
}

export async function patchTaxInfosService(
  enterpriseId: string,
  userId: string,
  input: PatchTaxInfosRequest
) {
  const body = patchTaxInfosRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/tax-infos`
  const raw = await apiFetch<unknown>(path, { method: "PATCH", body })
  return parseSuccessEnvelope(raw, taxInfosSchema, `PATCH ${path}`)
}

export async function postFinancialInfoService(
  enterpriseId: string,
  userId: string,
  input: PostFinancialInfoRequest
) {
  const body = postFinancialInfoRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/financial-info`
  const raw = await apiFetch<unknown>(path, { method: "POST", body })
  return parseSuccessEnvelope(raw, financialInfoSchema, `POST ${path}`)
}

export async function patchFinancialInfoService(
  enterpriseId: string,
  userId: string,
  input: PatchFinancialInfoRequest
) {
  const body = patchFinancialInfoRequestSchema.parse(input)
  const path = `${userOnboardingBase(enterpriseId, userId)}/financial-info`
  const raw = await apiFetch<unknown>(path, { method: "PATCH", body })
  return parseSuccessEnvelope(raw, financialInfoSchema, `PATCH ${path}`)
}
