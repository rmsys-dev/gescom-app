import { z } from "zod"

import { apiFetch } from "@/lib/api/client"
import {
  parsePaginatedEnvelope,
  parseSuccessEnvelope,
} from "@/lib/api/parse-response"
import {
  buildPaymentTypesQuery,
  buildSalesQuery,
  listPaymentTypesQuerySchema,
  listSalesQuerySchema,
} from "@/modules/sales/sales-query"
import {
  budgetConversionSchema,
  convertBudgetToSaleRequestSchema,
  createFullReturnRequestSchema,
  createPartialReturnRequestSchema,
  createSaleItemRequestSchema,
  createSaleRequestSchema,
  paymentTypeSchema,
  saleDetailSchema,
  saleItemSchema,
  saleReturnDetailSchema,
  saleReturnSchema,
  saleSummarySchema,
  updateSaleItemRequestSchema,
  updateSaleRequestSchema,
  type ConvertBudgetToSaleRequest,
  type CreateFullReturnRequest,
  type CreatePartialReturnRequest,
  type CreateSaleItemRequest,
  type CreateSaleRequest,
  type ListPaymentTypesQuery,
  type ListSalesQuery,
  type UpdateSaleItemRequest,
  type UpdateSaleRequest,
} from "@/modules/sales/sales.schema"

export async function listSalesService(query: ListSalesQuery = {}) {
  const parsed = listSalesQuerySchema.parse(query)
  const qs = buildSalesQuery(parsed)
  const raw = await apiFetch<unknown>(`sales${qs}`, { method: "GET" })
  return parsePaginatedEnvelope(raw, saleSummarySchema, "GET /sales")
}

export async function getSaleService(saleId: string) {
  const raw = await apiFetch<unknown>(`sales/${saleId}`, { method: "GET" })
  return parseSuccessEnvelope(raw, saleDetailSchema, `GET /sales/${saleId}`)
}

export async function listSaleReturnsService(saleId: string) {
  const raw = await apiFetch<unknown>(`sales/${saleId}/returns`, {
    method: "GET",
  })
  return parseSuccessEnvelope(
    raw,
    z.array(saleReturnSchema),
    `GET /sales/${saleId}/returns`
  )
}

export async function getSaleReturnService(
  saleId: string,
  salesReturnId: string
) {
  const raw = await apiFetch<unknown>(
    `sales/${saleId}/returns/${salesReturnId}`,
    { method: "GET" }
  )
  return parseSuccessEnvelope(
    raw,
    saleReturnDetailSchema,
    `GET /sales/${saleId}/returns/${salesReturnId}`
  )
}

export async function listBudgetConversionsService(saleId: string) {
  const raw = await apiFetch<unknown>(
    `sales/${saleId}/budget-conversions`,
    { method: "GET" }
  )
  return parseSuccessEnvelope(
    raw,
    z.array(budgetConversionSchema),
    `GET /sales/${saleId}/budget-conversions`
  )
}

export async function listPaymentTypesService(
  query: ListPaymentTypesQuery = {}
) {
  const parsed = listPaymentTypesQuerySchema.parse(query)
  const qs = buildPaymentTypesQuery(parsed)
  const raw = await apiFetch<unknown>(`payment-types${qs}`, { method: "GET" })
  return parsePaginatedEnvelope(raw, paymentTypeSchema, "GET /payment-types")
}

export async function getPaymentTypeService(paymentTypeId: string) {
  const raw = await apiFetch<unknown>(`payment-types/${paymentTypeId}`, {
    method: "GET",
  })
  return parseSuccessEnvelope(
    raw,
    paymentTypeSchema,
    `GET /payment-types/${paymentTypeId}`
  )
}

export async function createSaleService(input: CreateSaleRequest) {
  const body = createSaleRequestSchema.parse(input)
  const raw = await apiFetch<unknown>("sales", { method: "POST", body })
  return parseSuccessEnvelope(raw, saleDetailSchema, "POST /sales")
}

export async function updateSaleService(
  saleId: string,
  input: UpdateSaleRequest
) {
  const body = updateSaleRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}`, {
    method: "PATCH",
    body,
  })
  return parseSuccessEnvelope(raw, saleDetailSchema, `PATCH /sales/${saleId}`)
}

export async function recalculateTotalsService(saleId: string) {
  const raw = await apiFetch<unknown>(`sales/${saleId}/recalculate-totals`, {
    method: "POST",
  })
  return parseSuccessEnvelope(
    raw,
    saleDetailSchema,
    `POST /sales/${saleId}/recalculate-totals`
  )
}

export async function convertToSaleService(
  saleId: string,
  input: ConvertBudgetToSaleRequest
) {
  const body = convertBudgetToSaleRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}/convert-to-sale`, {
    method: "POST",
    body,
  })
  return parseSuccessEnvelope(
    raw,
    saleDetailSchema,
    `POST /sales/${saleId}/convert-to-sale`
  )
}

export async function addSaleItemService(
  saleId: string,
  input: CreateSaleItemRequest
) {
  const body = createSaleItemRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}/items`, {
    method: "POST",
    body,
  })
  return parseSuccessEnvelope(
    raw,
    saleItemSchema,
    `POST /sales/${saleId}/items`
  )
}

export async function updateSaleItemService(
  saleId: string,
  saleItemId: string,
  input: UpdateSaleItemRequest
) {
  const body = updateSaleItemRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}/items/${saleItemId}`, {
    method: "PATCH",
    body,
  })
  return parseSuccessEnvelope(
    raw,
    saleItemSchema,
    `PATCH /sales/${saleId}/items/${saleItemId}`
  )
}

export async function removeSaleItemService(saleId: string, saleItemId: string) {
  await apiFetch<unknown>(`sales/${saleId}/items/${saleItemId}`, {
    method: "DELETE",
  })
}

export async function createPartialReturnService(
  saleId: string,
  input: CreatePartialReturnRequest
) {
  const body = createPartialReturnRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}/returns/partial`, {
    method: "POST",
    body,
  })
  return parseSuccessEnvelope(
    raw,
    saleReturnDetailSchema,
    `POST /sales/${saleId}/returns/partial`
  )
}

export async function createFullReturnService(
  saleId: string,
  input: CreateFullReturnRequest = {}
) {
  const body = createFullReturnRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}/returns/full`, {
    method: "POST",
    body,
  })
  return parseSuccessEnvelope(
    raw,
    saleReturnDetailSchema,
    `POST /sales/${saleId}/returns/full`
  )
}
