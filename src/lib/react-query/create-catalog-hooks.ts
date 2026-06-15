"use client"

import { useQuery } from "@tanstack/react-query"

import { CACHE, gcTimeForStaleTime } from "@/lib/react-query/cache-policy"
import { useActiveEnterpriseId } from "@/lib/tenant/use-active-enterprise-id"

type PaginatedResult<T> = {
  items: T[]
  total: number
  limit: number
  offset: number
}

export function createCatalogListDetailHooks<
  TItem,
  TFilters extends Record<string, unknown> = Record<string, never>,
>(config: {
  listKey: (
    enterpriseId: string,
    filters?: TFilters
  ) => readonly unknown[]
  detailKey: (enterpriseId: string, id: string) => readonly unknown[]
  listFn: (filters: TFilters) => Promise<PaginatedResult<TItem>>
  getFn: (id: string) => Promise<TItem>
  staleTime?: number
  gcTime?: number
}) {
  const staleTime = config.staleTime ?? CACHE.globalCatalog
  const gcTime = config.gcTime ?? gcTimeForStaleTime(staleTime)

  function useListQuery({
    filters = {} as TFilters,
    enabled = true,
  }: {
    filters?: TFilters
    enabled?: boolean
  } = {}) {
    const enterpriseId = useActiveEnterpriseId()
    return useQuery({
      queryKey: config.listKey(enterpriseId ?? "", filters),
      queryFn: () => config.listFn(filters),
      enabled: enabled && Boolean(enterpriseId),
      staleTime,
      gcTime,
    })
  }

  function useDetailQuery({
    id,
    enabled = true,
  }: {
    id: string | undefined
    enabled?: boolean
  }) {
    const enterpriseId = useActiveEnterpriseId()
    return useQuery({
      queryKey: config.detailKey(enterpriseId ?? "", id ?? ""),
      queryFn: () => config.getFn(id!),
      enabled: enabled && Boolean(enterpriseId) && Boolean(id),
      staleTime,
      gcTime,
    })
  }

  return { useListQuery, useDetailQuery }
}
