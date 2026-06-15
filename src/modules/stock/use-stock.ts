"use client"

import { useQuery } from "@tanstack/react-query"

import { useActiveEnterpriseId } from "@/lib/tenant/use-active-enterprise-id"
import {
  listStockBatchBalancesService,
  listStockBatchesService,
  listStockLocationsService,
  listStockMinMaxService,
  listStockMovementsService,
  listStockSectorRentalsService,
  listStockSectorsService,
} from "@/modules/stock/stock.service"
import type {
  ListStockMovementsQuery,
  PaginationQuery,
} from "@/modules/stock/stock.schema"

import { CACHE } from "@/lib/react-query/cache-policy"
import { stockQueryKeys } from "@/modules/stock/stock-query-keys"

export { stockQueryKeys } from "@/modules/stock/stock-query-keys"

type ListHookOptions = {
  filters?: PaginationQuery | ListStockMovementsQuery
  enabled?: boolean
}

export function useStockSectorsQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: stockQueryKeys.sectors(enterpriseId ?? "", filters),
    queryFn: () => listStockSectorsService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantList,
  })
}

export function useStockLocationsQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: stockQueryKeys.locations(enterpriseId ?? "", filters),
    queryFn: () => listStockLocationsService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantList,
  })
}

export function useStockBatchesQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: stockQueryKeys.batches(enterpriseId ?? "", filters),
    queryFn: () => listStockBatchesService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantList,
  })
}

export function useStockSectorRentalsQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: stockQueryKeys.sectorRentals(enterpriseId ?? "", filters),
    queryFn: () => listStockSectorRentalsService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantList,
  })
}

export function useStockBatchBalancesQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: stockQueryKeys.batchBalances(enterpriseId ?? "", filters),
    queryFn: () => listStockBatchBalancesService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantList,
  })
}

export function useStockMinMaxQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: stockQueryKeys.minMax(enterpriseId ?? "", filters),
    queryFn: () => listStockMinMaxService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantList,
  })
}

export function useStockMovementsQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  const enterpriseId = useActiveEnterpriseId()
  const movementFilters = filters as ListStockMovementsQuery
  return useQuery({
    queryKey: stockQueryKeys.movements(enterpriseId ?? "", movementFilters),
    queryFn: () => listStockMovementsService(movementFilters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantList,
  })
}
