"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getPaymentTypeService,
  getSaleReturnService,
  getSaleService,
  listBudgetConversionsService,
  listPaymentTypesService,
  listSaleReturnsService,
  listSalesService,
} from "@/modules/sales/sales.service"
import type {
  ListPaymentTypesQuery,
  ListSalesQuery,
} from "@/modules/sales/sales.schema"

import { CACHE } from "@/lib/react-query/cache-policy"
import { salesQueryKeys } from "@/modules/sales/sales-query-keys"

export { salesQueryKeys } from "@/modules/sales/sales-query-keys"

export function useSalesQuery({
  enterpriseId,
  filters,
  enabled = true,
}: {
  enterpriseId: string | undefined
  filters?: ListSalesQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.list(enterpriseId ?? "", filters),
    queryFn: () => listSalesService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantList,
  })
}

export function useSaleQuery({
  enterpriseId,
  saleId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  saleId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.detail(enterpriseId ?? "", saleId),
    queryFn: () => getSaleService(saleId),
    enabled: enabled && Boolean(enterpriseId) && Boolean(saleId),
    staleTime: CACHE.tenantDetail,
  })
}

export function useSaleReturnsQuery({
  enterpriseId,
  saleId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  saleId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.returns(enterpriseId ?? "", saleId),
    queryFn: () => listSaleReturnsService(saleId),
    enabled: enabled && Boolean(enterpriseId) && Boolean(saleId),
    staleTime: CACHE.tenantList,
  })
}

export function useSaleReturnQuery({
  enterpriseId,
  saleId,
  returnId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  saleId: string
  returnId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.returnDetail(enterpriseId ?? "", saleId, returnId),
    queryFn: () => getSaleReturnService(saleId, returnId),
    enabled:
      enabled && Boolean(enterpriseId) && Boolean(saleId) && Boolean(returnId),
    staleTime: CACHE.tenantDetail,
  })
}

export function useBudgetConversionsQuery({
  enterpriseId,
  saleId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  saleId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.budgetConversions(enterpriseId ?? "", saleId),
    queryFn: () => listBudgetConversionsService(saleId),
    enabled: enabled && Boolean(enterpriseId) && Boolean(saleId),
    staleTime: CACHE.tenantList,
  })
}

export function usePaymentTypesQuery({
  enterpriseId,
  filters,
  enabled = true,
}: {
  enterpriseId: string | undefined
  filters?: ListPaymentTypesQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.paymentTypes(enterpriseId ?? "", filters),
    queryFn: () => listPaymentTypesService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantCatalog,
  })
}

export function usePaymentTypeQuery({
  enterpriseId,
  paymentTypeId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  paymentTypeId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.paymentType(enterpriseId ?? "", paymentTypeId),
    queryFn: () => getPaymentTypeService(paymentTypeId),
    enabled: enabled && Boolean(enterpriseId) && Boolean(paymentTypeId),
    staleTime: CACHE.tenantDetail,
  })
}
