import { z } from "zod"

import { paginationQuerySchema } from "@/lib/schemas/pagination"
import {
  budgetClosureSituationSchema,
  paymentTypeStatusSchema,
  saleStatusSchema,
  saleTypeSchema,
} from "@/modules/sales/sales-enums"

export const listSalesQuerySchema = paginationQuerySchema.extend({
  type: saleTypeSchema.optional(),
  status: saleStatusSchema.optional(),
  budgetClosureSituation: budgetClosureSituationSchema.optional(),
  userId: z.uuid().optional(),
  orderNumber: z.string().trim().min(1).optional(),
  seller: z.string().trim().min(1).optional(),
  client: z.string().trim().min(1).optional(),
})

export type ListSalesQuery = z.infer<typeof listSalesQuerySchema>

export const listPaymentTypesQuerySchema = paginationQuerySchema.extend({
  status: paymentTypeStatusSchema.optional(),
})

export type ListPaymentTypesQuery = z.infer<typeof listPaymentTypesQuerySchema>

export function buildSalesQuery(query: ListSalesQuery): string {
  const params = new URLSearchParams()
  if (query.limit !== undefined) params.set("limit", String(query.limit))
  if (query.offset !== undefined) params.set("offset", String(query.offset))
  if (query.type !== undefined) params.set("type", query.type)
  if (query.status !== undefined) params.set("status", query.status)
  if (query.budgetClosureSituation !== undefined) {
    params.set("budgetClosureSituation", query.budgetClosureSituation)
  }
  if (query.userId !== undefined) params.set("userId", query.userId)
  if (query.orderNumber !== undefined) params.set("orderNumber", query.orderNumber)
  if (query.seller !== undefined) params.set("seller", query.seller)
  if (query.client !== undefined) params.set("client", query.client)
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export function buildPaymentTypesQuery(query: ListPaymentTypesQuery): string {
  const params = new URLSearchParams()
  if (query.limit !== undefined) params.set("limit", String(query.limit))
  if (query.offset !== undefined) params.set("offset", String(query.offset))
  if (query.status !== undefined) params.set("status", query.status)
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}
