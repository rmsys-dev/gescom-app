import type { QueryClient } from "@tanstack/react-query"

import { CACHE, gcTimeForStaleTime } from "@/lib/react-query/cache-policy"

export function prefetchTenantQuery(
  queryClient: QueryClient,
  {
    queryKey,
    queryFn,
    staleTime = CACHE.tenantList,
  }: {
    queryKey: readonly unknown[]
    queryFn: () => Promise<unknown>
    staleTime?: number
  }
) {
  void queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime,
    gcTime: gcTimeForStaleTime(staleTime),
  })
}

export function prefetchTenantDetail(
  queryClient: QueryClient,
  {
    queryKey,
    queryFn,
  }: {
    queryKey: readonly unknown[]
    queryFn: () => Promise<unknown>
  }
) {
  prefetchTenantQuery(queryClient, {
    queryKey,
    queryFn,
    staleTime: CACHE.tenantDetail,
  })
}
