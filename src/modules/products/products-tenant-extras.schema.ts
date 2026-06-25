import { z } from "zod"
import {
  decimalSchema,
  paginationQuerySchema,
  type PaginationQuery,
} from "@/modules/products/products-query"

export type { PaginationQuery }

export const priceSchema = z.object({
  id: z.uuid(),
  price: decimalSchema,
  averageCost: decimalSchema.nullable().optional(),
  actualRealCost: decimalSchema.nullable().optional(),
  previousCost: decimalSchema.nullable().optional(),
  priceCost: decimalSchema.nullable().optional(),
  productsEnterprisesId: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type Price = z.infer<typeof priceSchema>

export const promotionalPriceSchema = z.object({
  id: z.uuid(),
  description: z.string().nullable(),
  price: decimalSchema,
  startDate: z.string(),
  endDate: z.string(),
  productsEnterprisesId: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type PromotionalPrice = z.infer<typeof promotionalPriceSchema>

export const productTaxationSchema = z.object({
  id: z.uuid(),
  cst_pis_entrada: z.string().nullable().optional(),
  cst_pis_saida: z.string().nullable().optional(),
  cst_cofins_entrada: z.string().nullable().optional(),
  cst_cofins_saida: z.string().nullable().optional(),
  productsEnterprisesId: z.uuid(),
  icmsTaxationId: z.uuid().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type ProductTaxation = z.infer<typeof productTaxationSchema>

export const productApplicationSchema = z.object({
  id: z.uuid(),
  description: z.string(),
  productsEnterprisesId: z.uuid(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type ProductApplication = z.infer<typeof productApplicationSchema>

export { paginationQuerySchema }
