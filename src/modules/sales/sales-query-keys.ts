import type {
  ListPaymentTypesQuery,
  ListSalesQuery,
} from "@/modules/sales/sales.schema"

export const salesQueryKeys = {
  all: ["sales"] as const,
  list: (enterpriseId: string, filters?: ListSalesQuery) =>
    ["sales", enterpriseId, "list", filters ?? {}] as const,
  detail: (enterpriseId: string, id: string) =>
    ["sales", enterpriseId, "detail", id] as const,
  returns: (enterpriseId: string, saleId: string) =>
    ["sales", enterpriseId, "returns", saleId] as const,
  returnDetail: (enterpriseId: string, saleId: string, returnId: string) =>
    ["sales", enterpriseId, "returns", saleId, returnId] as const,
  budgetConversions: (enterpriseId: string, saleId: string) =>
    ["sales", enterpriseId, "budget-conversions", saleId] as const,
  paymentTypes: (enterpriseId: string, filters?: ListPaymentTypesQuery) =>
    ["sales", enterpriseId, "payment-types", filters ?? {}] as const,
  paymentType: (enterpriseId: string, id: string) =>
    ["sales", enterpriseId, "payment-types", id] as const,
}
