"use client"

import { useQuery } from "@tanstack/react-query"

import type { AnalyticsQuery } from "@/modules/sales/sales-analytics.schema"
import {
  getOperationsCancellationsService,
  getOperationsStatusBreakdownService,
  getPipelineBudgetsFunnelService,
  getPipelineOverviewService,
  getRealizedByPaymentTypeService,
  getRealizedBySellerService,
  getRealizedOverviewService,
  getRealizedTimeseriesService,
  getRealizedTopProductsService,
  getReceivablesAgingService,
  getReceivablesSummaryService,
} from "@/modules/sales/sales-analytics.service"
import type { DashboardFilters } from "@/modules/sales/sales-constants"

import { CACHE } from "@/lib/react-query/cache-policy"

export const salesAnalyticsQueryKeys = {
  all: (enterpriseId: string) => ["sales-analytics", enterpriseId] as const,
  realizedOverview: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "realized-overview", filters] as const,
  realizedTimeseries: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "realized-timeseries", filters] as const,
  byPaymentType: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "by-payment-type", filters] as const,
  bySeller: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "by-seller", filters] as const,
  topProducts: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "top-products", filters] as const,
  pipelineOverview: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "pipeline-overview", filters] as const,
  budgetFunnel: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "budget-funnel", filters] as const,
  statusBreakdown: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "status-breakdown", filters] as const,
  cancellations: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "cancellations", filters] as const,
  receivablesSummary: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "receivables-summary", filters] as const,
  receivablesAging: (enterpriseId: string, filters: AnalyticsQuery) =>
    ["sales-analytics", enterpriseId, "receivables-aging", filters] as const,
}

export function dashboardFiltersToAnalyticsQuery(
  filters: DashboardFilters,
  extra?: Partial<AnalyticsQuery>
): AnalyticsQuery {
  const base: AnalyticsQuery = {
    timezone: filters.timezone,
    compareMode: filters.compareMode,
    userId: filters.userId,
  }

  if (filters.dateFrom && filters.dateTo) {
    return { ...base, dateFrom: filters.dateFrom, dateTo: filters.dateTo, ...extra }
  }

  return { ...base, periodPreset: filters.periodPreset, ...extra }
}

type AnalyticsQueryOpts = {
  enterpriseId: string | undefined
  filters: AnalyticsQuery
  enabled?: boolean
}

export function useRealizedOverviewQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.realizedOverview(enterpriseId ?? "", filters),
    queryFn: () => getRealizedOverviewService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}

export function useRealizedTimeseriesQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.realizedTimeseries(enterpriseId ?? "", filters),
    queryFn: () => getRealizedTimeseriesService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}

export function useRealizedByPaymentTypeQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.byPaymentType(enterpriseId ?? "", filters),
    queryFn: () => getRealizedByPaymentTypeService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}

export function useRealizedBySellerQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.bySeller(enterpriseId ?? "", filters),
    queryFn: () => getRealizedBySellerService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}

export function useRealizedTopProductsQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.topProducts(enterpriseId ?? "", filters),
    queryFn: () => getRealizedTopProductsService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}

export function usePipelineOverviewQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.pipelineOverview(enterpriseId ?? "", filters),
    queryFn: () => getPipelineOverviewService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}

export function useBudgetFunnelQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.budgetFunnel(enterpriseId ?? "", filters),
    queryFn: () => getPipelineBudgetsFunnelService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}

export function useOperationsStatusBreakdownQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.statusBreakdown(enterpriseId ?? "", filters),
    queryFn: () => getOperationsStatusBreakdownService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}

export function useOperationsCancellationsQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.cancellations(enterpriseId ?? "", filters),
    queryFn: () => getOperationsCancellationsService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}

export function useReceivablesSummaryQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.receivablesSummary(enterpriseId ?? "", filters),
    queryFn: () => getReceivablesSummaryService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}

export function useReceivablesAgingQuery({
  enterpriseId,
  filters,
  enabled = true,
}: AnalyticsQueryOpts) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.receivablesAging(enterpriseId ?? "", filters),
    queryFn: () => getReceivablesAgingService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.analytics,
  })
}
