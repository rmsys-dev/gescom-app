import { z } from "zod"

export const saleTypeSchema = z.enum(["VENDA", "ORCAMENTO"])
export type SaleType = z.infer<typeof saleTypeSchema>

export const saleStatusSchema = z.enum(["ABERTA", "FINALIZADA", "CANCELADA"])
export type SaleStatus = z.infer<typeof saleStatusSchema>

export const budgetClosureSituationSchema = z.enum(["ABERTO", "PARCIAL", "FECHADO"])
export type BudgetClosureSituation = z.infer<typeof budgetClosureSituationSchema>

export const returnSituationSchema = z.enum(["SEM_DEVOLUCAO", "PARCIAL", "TOTAL"])
export type ReturnSituation = z.infer<typeof returnSituationSchema>

export const saleReturnKindSchema = z.enum(["PARCIAL", "TOTAL"])
export type SaleReturnKind = z.infer<typeof saleReturnKindSchema>

export const saleReturnStatusSchema = z.enum([
  "ABERTA",
  "FINALIZADA",
  "CANCELADA",
])
export type SaleReturnStatus = z.infer<typeof saleReturnStatusSchema>

export const paymentTypeStatusSchema = z.enum(["ATIVO", "INATIVO"])
export type PaymentTypeStatus = z.infer<typeof paymentTypeStatusSchema>

export const saleOriginSchema = z.enum(["WEB", "MOBILE"])
export type SaleOrigin = z.infer<typeof saleOriginSchema>

export const stockBatchStatusSchema = z.enum(["ATIVO", "BLOQUEADO", "ESGOTADO"])
export type StockBatchStatus = z.infer<typeof stockBatchStatusSchema>

export const stockMovementTypeSchema = z.enum([
  "ENTRADA",
  "SAIDA",
  "TRANSFERENCIA",
  "AJUSTE",
  "PERDA",
  "VENDA",
  "COMPRA",
  "DEVOLUCAO",
  "CANCELAMENTO",
  "OUTROS",
])
export type StockMovementType = z.infer<typeof stockMovementTypeSchema>

export { decimalSchema } from "@/lib/schemas/decimal"
