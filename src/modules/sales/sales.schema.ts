import { z } from "zod"

import {
  budgetClosureSituationSchema,
  decimalSchema,
  paymentTypeStatusSchema,
  returnSituationSchema,
  saleOriginSchema,
  saleReturnKindSchema,
  saleReturnStatusSchema,
  saleStatusSchema,
  saleTypeSchema,
} from "@/modules/sales/sales-enums"

export const saleSummarySchema = z.object({
  id: z.uuid(),
  orderNumber: z.number().int(),
  userId: z.uuid(),
  userLegalName: z.string(),
  sellerId: z.uuid(),
  sellerLegalName: z.string(),
  memberId: z.uuid().nullable(),
  memberName: z.string().nullable(),
  type: saleTypeSchema,
  status: saleStatusSchema,
  budgetClosureSituation: budgetClosureSituationSchema,
  returnSituation: returnSituationSchema,
  subTotal: decimalSchema,
  valueLiquid: decimalSchema,
  percentageDiscount: decimalSchema.nullable(),
  valueDiscountFinancial: decimalSchema.nullable(),
  sourceBudgetSaleId: z.uuid().nullable(),
  completedionDate: z.string().nullable(),
  enterprisesId: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type SaleSummary = z.infer<typeof saleSummarySchema>

export const saleItemSchema = z.object({
  id: z.uuid(),
  saleId: z.uuid().optional(),
  productsEnterprisesId: z.uuid(),
  quantity: decimalSchema,
  quantityReturned: decimalSchema.nullable().optional(),
  valueUnit: decimalSchema,
  valueTotal: decimalSchema,
  percentageDiscount: decimalSchema.nullable().optional(),
  valueDiscount: decimalSchema.nullable().optional(),
  productDescription: z.string().nullable().optional(),
  unitDescription: z.string().nullable().optional(),
})

export type SaleItem = z.infer<typeof saleItemSchema>

export const saleDueSchema = z.object({
  id: z.uuid(),
  salesPaymentId: z.uuid(),
  salesId: z.uuid().optional(),
  valueInstallment: decimalSchema,
  dueDate: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type SaleDue = z.infer<typeof saleDueSchema>

export const salePaymentSchema = z.object({
  id: z.uuid(),
  salesId: z.uuid().optional(),
  paymentTypeId: z.uuid(),
  paymentTypeDescription: z.string().nullable().optional(),
  valueTotal: decimalSchema,
  dues: z.array(saleDueSchema).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type SalePayment = z.infer<typeof salePaymentSchema>

export const generatedSaleSummarySchema = z.object({
  id: z.uuid(),
  orderNumber: z.number().int(),
  status: saleStatusSchema,
  valueLiquid: decimalSchema,
})

export type GeneratedSaleSummary = z.infer<typeof generatedSaleSummarySchema>

export const sourceBudgetSummarySchema = z.object({
  id: z.uuid(),
  orderNumber: z.number().int(),
  status: saleStatusSchema,
  valueLiquid: decimalSchema.optional(),
})

export type SourceBudgetSummary = z.infer<typeof sourceBudgetSummarySchema>

export const saleDetailSchema = saleSummarySchema.extend({
  items: z.array(saleItemSchema).default([]),
  payments: z.array(salePaymentSchema).default([]),
  generatedSales: z.array(generatedSaleSummarySchema).optional(),
  sourceBudget: sourceBudgetSummarySchema.nullable().optional(),
})

export type SaleDetail = z.infer<typeof saleDetailSchema>

export const saleReturnSchema = z.object({
  id: z.uuid(),
  returnNumber: z.number().int(),
  saleId: z.uuid(),
  enterprisesId: z.uuid(),
  userId: z.uuid(),
  status: saleReturnStatusSchema,
  kind: saleReturnKindSchema,
  valueTotal: decimalSchema,
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type SaleReturn = z.infer<typeof saleReturnSchema>

export const saleReturnItemSchema = z.object({
  id: z.uuid(),
  salesReturnId: z.uuid(),
  saleItemId: z.uuid(),
  quantity: decimalSchema,
  valueTotal: decimalSchema,
  saleItem: saleItemSchema.nullable().optional(),
})

export type SaleReturnItem = z.infer<typeof saleReturnItemSchema>

export const saleReturnDetailSchema = saleReturnSchema.extend({
  items: z.array(saleReturnItemSchema).default([]),
})

export type SaleReturnDetail = z.infer<typeof saleReturnDetailSchema>

export const budgetConversionSchema = z.object({
  id: z.uuid(),
  budgetSaleId: z.uuid(),
  generatedSaleId: z.uuid(),
  generatedOrderNumber: z.number().int(),
  generatedStatus: saleStatusSchema,
  generatedValueLiquid: decimalSchema,
  closureKind: z.string(),
  userId: z.uuid(),
  userLegalName: z.string(),
  createdAt: z.string(),
})

export type BudgetConversion = z.infer<typeof budgetConversionSchema>

export const paymentTypeSchema = z.object({
  id: z.uuid(),
  description: z.string(),
  status: paymentTypeStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type PaymentType = z.infer<typeof paymentTypeSchema>

export {
  listSalesQuerySchema,
  listPaymentTypesQuerySchema,
  type ListSalesQuery,
  type ListPaymentTypesQuery,
} from "@/modules/sales/sales-query"

// --- Escrita (POST/PATCH/DELETE) ---

const saleDueInputSchema = z.strictObject({
  valueInstallment: z.number().positive(),
  dueDate: z.string(),
})

export type SaleDueInput = z.infer<typeof saleDueInputSchema>

const salePaymentInputSchema = z.strictObject({
  valueTotal: z.number().positive(),
  paymentTypeId: z.uuid(),
  dues: z.array(saleDueInputSchema).min(1),
})

export type SalePaymentInput = z.infer<typeof salePaymentInputSchema>

export const saleItemInputSchema = z.strictObject({
  quantity: z.number().positive(),
  valueUnit: z.number().min(0),
  valueDiscount: z.number().min(0).optional(),
  valueAcresce: z.number().min(0).optional(),
  valueTotal: z.number().min(0).optional(),
  productsEnterprisesId: z.uuid(),
  unitId: z.uuid(),
  productTypeId: z.uuid(),
  stockSectorId: z.uuid().optional(),
  stockLocationId: z.uuid().optional(),
  stockBatchId: z.uuid().optional(),
  sellerId: z.uuid().optional(),
  origin: saleOriginSchema.optional(),
})

export type SaleItemInput = z.infer<typeof saleItemInputSchema>

export const createSaleRequestSchema = z.strictObject({
  orderNumber: z.number().int().positive().optional(),
  memberId: z.uuid(),
  sellerId: z.uuid().optional(),
  type: saleTypeSchema,
  percentageDiscount: z.number().optional(),
  discountValuetems: z.number().optional(),
  valueDiscountFinancial: z.number().optional(),
  percentageAcresce: z.number().optional(),
  valueAcresceItems: z.number().optional(),
  valueAcresceFinancial: z.number().optional(),
  status: saleStatusSchema.optional(),
  origin: saleOriginSchema.optional(),
  items: z.array(saleItemInputSchema).min(1),
  payments: z.array(salePaymentInputSchema).optional(),
})

export type CreateSaleRequest = z.infer<typeof createSaleRequestSchema>

export const updateSaleRequestSchema = z
  .strictObject({
    memberId: z.uuid().optional(),
    sellerId: z.uuid().optional(),
    status: saleStatusSchema.optional(),
    percentageDiscount: z.number().min(0).max(100).nullable().optional(),
    discountValuetems: z.number().optional(),
    valueDiscountFinancial: z.number().min(0).optional(),
    percentageAcresce: z.number().min(0).max(100).nullable().optional(),
    valueAcresceItems: z.number().optional(),
    valueAcresceFinancial: z.number().min(0).optional(),
    valueLiquid: z.number().min(0).optional(),
    completedionDate: z.string().nullable().optional(),
    recalculateTotals: z.boolean().optional(),
    payments: z.array(salePaymentInputSchema).min(1).optional(),
    origin: saleOriginSchema.optional(),
  })
  .refine(
    (data) =>
      Object.entries(data).some(
        ([key, value]) => key !== "recalculateTotals" && value !== undefined
      ),
    { message: "Informe ao menos um campo para alterar." }
  )

export type UpdateSaleRequest = z.infer<typeof updateSaleRequestSchema>

export const createSaleItemRequestSchema = saleItemInputSchema

export type CreateSaleItemRequest = z.infer<typeof createSaleItemRequestSchema>

export const updateSaleItemRequestSchema = z
  .strictObject({
    quantity: z.number().positive().optional(),
    valueUnit: z.number().min(0).optional(),
    valueDiscount: z.number().min(0).optional(),
    valueAcresce: z.number().min(0).optional(),
    productsEnterprisesId: z.uuid().optional(),
    unitId: z.uuid().optional(),
    productTypeId: z.uuid().optional(),
    stockSectorId: z.uuid().optional(),
    stockLocationId: z.uuid().optional(),
    stockBatchId: z.uuid().nullable().optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: "Informe ao menos um campo para alterar." }
  )

export type UpdateSaleItemRequest = z.infer<typeof updateSaleItemRequestSchema>

export const convertBudgetItemInputSchema = z.strictObject({
  budgetItemId: z.uuid(),
  quantity: z.number().min(0),
  unclosedJustification: z.string().trim().min(1).max(500).optional(),
  stockSectorId: z.uuid().optional(),
  stockLocationId: z.uuid().optional(),
  stockBatchId: z.uuid().nullable().optional(),
})

export type ConvertBudgetItemInput = z.infer<typeof convertBudgetItemInputSchema>

export const convertBudgetToSaleRequestSchema = z.strictObject({
  status: saleStatusSchema,
  sellerId: z.uuid().optional(),
  memberId: z.uuid().optional(),
  items: z.array(convertBudgetItemInputSchema).min(1),
  percentageDiscount: z.number().optional(),
  discountValuetems: z.number().optional(),
  valueDiscountFinancial: z.number().optional(),
  percentageAcresce: z.number().optional(),
  valueAcresceItems: z.number().optional(),
  valueAcresceFinancial: z.number().optional(),
  payments: z.array(salePaymentInputSchema).optional(),
  origin: saleOriginSchema.optional(),
})

export type ConvertBudgetToSaleRequest = z.infer<
  typeof convertBudgetToSaleRequestSchema
>

export const createPartialReturnRequestSchema = z.strictObject({
  notes: z.string().trim().max(500).optional(),
  items: z
    .array(
      z.strictObject({
        saleItemId: z.uuid(),
        quantity: z.number().positive(),
      })
    )
    .min(1),
})

export type CreatePartialReturnRequest = z.infer<
  typeof createPartialReturnRequestSchema
>

export const createFullReturnRequestSchema = z.strictObject({
  notes: z.string().trim().max(500).optional(),
})

export type CreateFullReturnRequest = z.infer<typeof createFullReturnRequestSchema>
