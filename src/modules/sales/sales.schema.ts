import { z } from "zod"

import {
  budgetClosureSituationSchema,
  decimalSchema,
  paymentTypeStatusSchema,
  returnSituationSchema,
  saleReturnKindSchema,
  saleReturnStatusSchema,
  saleStatusSchema,
  saleTypeSchema,
} from "@/modules/sales/sales-enums"

export const saleSummarySchema = z.object({
  id: z.uuid(),
  orderNumber: z.number().int(),
  userId: z.uuid(),
  UserName: z.string(),
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
  valueLiquid: decimalSchema,
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
