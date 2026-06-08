"use client"

import { useCallback, useMemo, useState } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import { SalesAgingChart } from "@/app/(app_routes)/sales/_components/sales-aging-chart"
import { SalesByPaymentTypeChart } from "@/app/(app_routes)/sales/_components/sales-by-payment-type-chart"
import { SalesBySellerChart } from "@/app/(app_routes)/sales/_components/sales-by-seller-chart"
import { SalesCancellationsChart } from "@/app/(app_routes)/sales/_components/sales-cancellations-chart"
import { SalesDashboardFilters } from "@/app/(app_routes)/sales/_components/sales-dashboard-filters"
import { SalesFunnelChart } from "@/app/(app_routes)/sales/_components/sales-funnel-chart"
import { SalesKpiCards } from "@/app/(app_routes)/sales/_components/sales-kpi-cards"
import { SalesOperationsTable } from "@/app/(app_routes)/sales/_components/sales-operations-table"
import { SalesPipelineCards } from "@/app/(app_routes)/sales/_components/sales-pipeline-cards"
import { SalesDashboardLoading } from "@/app/(app_routes)/sales/_components/sales-route-loading"
import { SalesTimeseriesChart } from "@/app/(app_routes)/sales/_components/sales-timeseries-chart"
import { SalesTopProductsTable } from "@/app/(app_routes)/sales/_components/sales-top-products-table"
import {
  ListErrorCard,
  PaginatedListLayout,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import type { TopProductsSortBy } from "@/modules/sales/sales-analytics.schema"
import {
  defaultDashboardFilters,
  type DashboardFilters,
} from "@/modules/sales/sales-constants"
import {
  dashboardFiltersToAnalyticsQuery,
  useBudgetFunnelQuery,
  useOperationsCancellationsQuery,
  useOperationsStatusBreakdownQuery,
  usePipelineOverviewQuery,
  useRealizedByPaymentTypeQuery,
  useRealizedBySellerQuery,
  useRealizedOverviewQuery,
  useRealizedTimeseriesQuery,
  useRealizedTopProductsQuery,
  useReceivablesAgingQuery,
  useReceivablesSummaryQuery,
} from "@/modules/sales/use-sales-analytics"

export default function SalesDashboardPage() {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const [draftFilters, setDraftFilters] = useState<DashboardFilters>(
    defaultDashboardFilters()
  )
  const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>(
    defaultDashboardFilters()
  )
  const [useCustomRange, setUseCustomRange] = useState(false)
  const [topProductsSortBy, setTopProductsSortBy] =
    useState<TopProductsSortBy>("revenue")

  const enabled = ready && perms.canConsultSales

  const baseQuery = useMemo(
    () => dashboardFiltersToAnalyticsQuery(appliedFilters),
    [appliedFilters]
  )

  const timeseriesQuery = useMemo(
    () =>
      dashboardFiltersToAnalyticsQuery(appliedFilters, {
        granularity: appliedFilters.granularity,
      }),
    [appliedFilters]
  )

  const topProductsQuery = useMemo(
    () =>
      dashboardFiltersToAnalyticsQuery(appliedFilters, {
        sortBy: topProductsSortBy,
        limit: 10,
      }),
    [appliedFilters, topProductsSortBy]
  )

  const rankingQuery = useMemo(
    () => dashboardFiltersToAnalyticsQuery(appliedFilters, { limit: 10 }),
    [appliedFilters]
  )

  const receivablesQuery = useMemo(
    () => ({
      timezone: appliedFilters.timezone,
      userId: appliedFilters.userId,
    }),
    [appliedFilters.timezone, appliedFilters.userId]
  )

  const realizedOverview = useRealizedOverviewQuery({
    enterpriseId,
    filters: baseQuery,
    enabled,
  })
  const pipelineOverview = usePipelineOverviewQuery({
    enterpriseId,
    filters: baseQuery,
    enabled,
  })
  const timeseries = useRealizedTimeseriesQuery({
    enterpriseId,
    filters: timeseriesQuery,
    enabled,
  })
  const byPaymentType = useRealizedByPaymentTypeQuery({
    enterpriseId,
    filters: rankingQuery,
    enabled,
  })
  const bySeller = useRealizedBySellerQuery({
    enterpriseId,
    filters: rankingQuery,
    enabled,
  })
  const topProducts = useRealizedTopProductsQuery({
    enterpriseId,
    filters: topProductsQuery,
    enabled,
  })
  const budgetFunnel = useBudgetFunnelQuery({
    enterpriseId,
    filters: baseQuery,
    enabled,
  })
  const statusBreakdown = useOperationsStatusBreakdownQuery({
    enterpriseId,
    filters: baseQuery,
    enabled,
  })
  const cancellations = useOperationsCancellationsQuery({
    enterpriseId,
    filters: baseQuery,
    enabled,
  })
  const receivablesSummary = useReceivablesSummaryQuery({
    enterpriseId,
    filters: receivablesQuery,
    enabled,
  })
  const receivablesAging = useReceivablesAgingQuery({
    enterpriseId,
    filters: receivablesQuery,
    enabled,
  })

  const applyFilters = useCallback(() => {
    if (
      useCustomRange &&
      (!draftFilters.dateFrom || !draftFilters.dateTo)
    ) {
      return
    }
    setAppliedFilters({ ...draftFilters })
  }, [draftFilters, useCustomRange])

  const clearFilters = useCallback(() => {
    const reset = defaultDashboardFilters()
    setDraftFilters(reset)
    setAppliedFilters(reset)
    setUseCustomRange(false)
  }, [])

  function refreshAll() {
    void realizedOverview.refetch()
    void pipelineOverview.refetch()
    void timeseries.refetch()
    void byPaymentType.refetch()
    void bySeller.refetch()
    void topProducts.refetch()
    void budgetFunnel.refetch()
    void statusBreakdown.refetch()
    void cancellations.refetch()
    void receivablesSummary.refetch()
    void receivablesAging.refetch()
  }

  const isRefreshing =
    realizedOverview.isFetching ||
    pipelineOverview.isFetching ||
    timeseries.isFetching

  useRegisterPageRefresh({
    onRefresh: refreshAll,
    isFetching: isRefreshing,
    enabled: ready && perms.isReady && !perms.isError && perms.canConsultSales,
  })

  const primaryError =
    realizedOverview.error ??
    pipelineOverview.error ??
    timeseries.error

  const { errMessage, errMeta } = useListErrorState(
    primaryError,
    "Não foi possível carregar a dashboard de vendas."
  )

  const hasAnyData =
    Boolean(realizedOverview.data) ||
    Boolean(pipelineOverview.data) ||
    Boolean(timeseries.data)

  const isInitialLoading =
    enabled &&
    !hasAnyData &&
    (realizedOverview.isPending || pipelineOverview.isPending)

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout loading={<SalesDashboardLoading />}>
        {null}
      </PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />

  if (!perms.canConsultSales) {
    return <PermissionDeniedCard permissionLabel="consultar_vendas" />
  }

  return (
    <PaginatedListLayout
      loading={isInitialLoading ? <SalesDashboardLoading /> : null}
    >
      <div className="space-y-6">
        <RouteBreadcrumb currentLabel="Relatórios de Vendas" />
        <SalesDashboardFilters
          draft={draftFilters}
          onChange={setDraftFilters}
          onApply={applyFilters}
          onClear={clearFilters}
          useCustomRange={useCustomRange}
          onToggleCustomRange={setUseCustomRange}
        />

        {primaryError && hasAnyData && <StaleDataBanner message={errMessage} />}

        {primaryError && !hasAnyData && !isInitialLoading && (
          <ListErrorCard
            title="Erro ao carregar dashboard"
            message={errMessage}
            meta={errMeta}
          />
        )}

        {!isInitialLoading && (
          <>
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Receita realizada
              </h2>
              <SalesKpiCards
                kpis={realizedOverview.data?.kpis}
                loading={realizedOverview.isPending}
              />
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Pipeline e orçamentos
              </h2>
              <SalesPipelineCards
                kpis={pipelineOverview.data?.kpis}
                loading={pipelineOverview.isPending}
              />
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <SalesTimeseriesChart
                data={timeseries.data}
                loading={timeseries.isPending}
              />
              <SalesByPaymentTypeChart
                data={byPaymentType.data}
                loading={byPaymentType.isPending}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <SalesBySellerChart
                data={bySeller.data}
                loading={bySeller.isPending}
              />
              <SalesTopProductsTable
                data={topProducts.data}
                loading={topProducts.isPending}
                sortBy={topProductsSortBy}
                onSortByChange={setTopProductsSortBy}
              />
            </div>

            <SalesFunnelChart
              data={budgetFunnel.data}
              loading={budgetFunnel.isPending}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <SalesAgingChart
                summary={receivablesSummary.data}
                aging={receivablesAging.data}
                loading={
                  receivablesSummary.isPending || receivablesAging.isPending
                }
              />
              <SalesCancellationsChart
                data={cancellations.data}
                loading={cancellations.isPending}
              />
            </div>

            <SalesOperationsTable
              data={statusBreakdown.data}
              loading={statusBreakdown.isPending}
            />
          </>
        )}
      </div>
    </PaginatedListLayout>
  )
}
