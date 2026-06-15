"use client"

import { useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { prefetchTenantDetail } from "@/lib/react-query/prefetch"
import { salesQueryKeys } from "@/modules/sales/sales-query-keys"
import { getSaleService } from "@/modules/sales/sales.service"

export function usePrefetchSaleDetail(enterpriseId: string | undefined) {
  const queryClient = useQueryClient()

  return useCallback(
    (saleId: string) => {
      if (!enterpriseId || !saleId) return
      prefetchTenantDetail(queryClient, {
        queryKey: salesQueryKeys.detail(enterpriseId, saleId),
        queryFn: () => getSaleService(saleId),
      })
    },
    [enterpriseId, queryClient]
  )
}
