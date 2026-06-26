import { z } from "zod"

import {
  decimalSchema,
  stockBatchStatusSchema,
  stockMovementTypeSchema,
} from "@/modules/sales/sales-enums"
import {
  buildPaginationQuery,
  paginationQuerySchema,
  type PaginationQuery,
} from "@/modules/products/products-query"

export { paginationQuerySchema, type PaginationQuery }

export const stockSectorSchema = z.object({
  id: z.uuid(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type StockSector = z.infer<typeof stockSectorSchema>

/** Status de locação física — ver `stock_doc.md` §5.3. */
export const stockLocationStatusSchema = z.enum([
  "ATIVO",
  "INATIVO",
  "BLOQUEADO",
])

export type StockLocationStatus = z.infer<typeof stockLocationStatusSchema>

export const stockLocationSchema = z
  .object({
    id: z.uuid(),
    /** Campo canónico desde migração 0012. */
    box: z.string().nullable().optional(),
    /** Alias legado — espelha `box` em clientes antigos. */
    code: z.string().nullable().optional(),
    description: z.string().nullable(),
    stockSectorId: z.uuid(),
    status: stockLocationStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string().nullable(),
  })
  .transform(({ box, code, ...rest }) => ({
    ...rest,
    box: box ?? code ?? null,
    code: String(code ?? box ?? ""),
  }))

export type StockLocation = z.infer<typeof stockLocationSchema>

export function getStockLocationCode(
  location: Pick<StockLocation, "box" | "code">
): string {
  return String(location.code ?? location.box ?? "").trim()
}

export const stockBatchSchema = z.object({
  id: z.uuid(),
  batchNumber: z.string(),
  productsEnterprisesId: z.uuid(),
  manufacturingDate: z.string().nullable(),
  expiryDate: z.string().nullable(),
  documentRef: z.string().nullable(),
  status: stockBatchStatusSchema,
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type StockBatch = z.infer<typeof stockBatchSchema>

export const stockSectorRentalSchema = z.object({
  id: z.uuid(),
  productsEnterprisesId: z.uuid(),
  stockLocationId: z.uuid(),
  quantity: decimalSchema,
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type StockSectorRental = z.infer<typeof stockSectorRentalSchema>

export const stockBatchBalanceSchema = z.object({
  id: z.uuid(),
  stockBatchId: z.uuid(),
  stockLocationId: z.uuid(),
  quantity: decimalSchema,
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type StockBatchBalance = z.infer<typeof stockBatchBalanceSchema>

export const stockMinMaxSchema = z.object({
  id: z.uuid(),
  quantityMin: decimalSchema,
  quantityMax: decimalSchema,
  productsEnterprisesId: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type StockMinMax = z.infer<typeof stockMinMaxSchema>

export const stockMovementSchema = z.object({
  id: z.uuid(),
  transferGroupId: z.uuid(),
  type: stockMovementTypeSchema,
  productsEnterprisesId: z.uuid(),
  fromStockSectorId: z.uuid().nullable(),
  fromStockLocationId: z.uuid().nullable(),
  fromStockBatchId: z.uuid().nullable(),
  toStockSectorId: z.uuid().nullable(),
  toStockLocationId: z.uuid().nullable(),
  toStockBatchId: z.uuid().nullable(),
  quantity: decimalSchema,
  fromQuantityBefore: decimalSchema.nullable(),
  fromQuantityAfter: decimalSchema.nullable(),
  toQuantityBefore: decimalSchema.nullable(),
  toQuantityAfter: decimalSchema.nullable(),
  userId: z.uuid().nullable(),
  notes: z.string().nullable(),
  documentRef: z.string().nullable(),
  createdAt: z.string(),
})

export type StockMovement = z.infer<typeof stockMovementSchema>

export const listStockMovementsQuerySchema = paginationQuerySchema.extend({
  productsEnterprisesId: z.uuid().optional(),
  type: stockMovementTypeSchema.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export type ListStockMovementsQuery = z.infer<
  typeof listStockMovementsQuerySchema
>

export function buildStockMovementsQuery(query: ListStockMovementsQuery): string {
  const parsed = listStockMovementsQuerySchema.parse(query)
  const params = new URLSearchParams()
  if (parsed.limit !== undefined) params.set("limit", String(parsed.limit))
  if (parsed.offset !== undefined) params.set("offset", String(parsed.offset))
  if (parsed.productsEnterprisesId) {
    params.set("productsEnterprisesId", parsed.productsEnterprisesId)
  }
  if (parsed.type) params.set("type", parsed.type)
  if (parsed.dateFrom) params.set("dateFrom", parsed.dateFrom)
  if (parsed.dateTo) params.set("dateTo", parsed.dateTo)
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export const createStockMovementRequestSchema = z.strictObject({
  type: stockMovementTypeSchema,
  productsEnterprisesId: z.uuid(),
  quantity: z.number().positive(),
  fromStockLocationId: z.uuid().optional(),
  fromStockBatchId: z.uuid().optional(),
  toStockLocationId: z.uuid().optional(),
  toStockBatchId: z.uuid().optional(),
  notes: z.string().trim().max(500).optional(),
  documentRef: z.string().trim().max(100).optional(),
  transferGroupId: z.uuid().optional(),
})

export type CreateStockMovementRequest = z.infer<
  typeof createStockMovementRequestSchema
>

export { buildPaginationQuery }
