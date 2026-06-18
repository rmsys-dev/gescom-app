"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

import { HomeCancelledCards } from "@/app/(app_routes)/home/_components/home-cancelled-cards"
import { HomeRouteLoading } from "@/app/(app_routes)/home/_components/dashboard-route-loading"
import { HomeWelcomeCard } from "@/app/(app_routes)/home/_components/home-welcome-card"
import {
  ListErrorCard,
  PaginatedListLayout,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/components/global/listing/paginated-list-shell"
import { SalesKpiCards } from "@/app/(app_routes)/sales/_components/sales-kpi-cards"
import { SalesPipelineCards } from "@/app/(app_routes)/sales/_components/sales-pipeline-cards"
import { SalesDashboardLoading } from "@/app/(app_routes)/sales/_components/sales-route-loading"
import { useAuth } from "@/components/providers/authentication/auth-store"
import { useMinLoadingDisplay } from "@/hooks/use-min-loading-display"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import {
  defaultDashboardFilters,
} from "@/modules/sales/sales-constants"
import {
  dashboardFiltersToAnalyticsQuery,
  useOperationsStatusBreakdownQuery,
  usePipelineOverviewQuery,
  useRealizedOverviewQuery,
} from "@/modules/sales/use-sales-analytics"

const TODAY_FILTERS = {
  ...defaultDashboardFilters(),
  periodPreset: "today" as const,
}

export default function HomePage() {
  const router = useRouter()
  const { hydrated, enterprises, activeEnterprise } = useAuth()
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const needsEnterpriseSelection =
    enterprises.length > 1 && !activeEnterprise

  const showLoading = useMinLoadingDisplay(
    !hydrated || needsEnterpriseSelection,
  )

  const analyticsQuery = useMemo(
    () => dashboardFiltersToAnalyticsQuery(TODAY_FILTERS),
    []
  )

  const enabled = ready && perms.canConsultSales

  const realizedOverview = useRealizedOverviewQuery({
    enterpriseId,
    filters: analyticsQuery,
    enabled,
  })
  const pipelineOverview = usePipelineOverviewQuery({
    enterpriseId,
    filters: analyticsQuery,
    enabled,
  })
  const statusBreakdown = useOperationsStatusBreakdownQuery({
    enterpriseId,
    filters: analyticsQuery,
    enabled,
  })

  const primaryError =
    realizedOverview.error ??
    pipelineOverview.error ??
    statusBreakdown.error

  const { errMessage, errMeta } = useListErrorState(
    primaryError,
    "Não foi possível carregar os dados da home."
  )

  const hasAnyData =
    Boolean(realizedOverview.data) ||
    Boolean(pipelineOverview.data) ||
    Boolean(statusBreakdown.data)

  const isInitialLoading =
    enabled &&
    !hasAnyData &&
    (realizedOverview.isPending ||
      pipelineOverview.isPending ||
      statusBreakdown.isPending)

  useEffect(() => {
    if (!hydrated) return
    if (needsEnterpriseSelection) {
      router.replace("/auth/select-enterprise")
    }
  }, [hydrated, needsEnterpriseSelection, router])

  if (showLoading) {
    return <HomeRouteLoading />
  }

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
        <HomeWelcomeCard />

        {primaryError && hasAnyData && <StaleDataBanner message={errMessage} />}

        {primaryError && !hasAnyData && !isInitialLoading && (
          <ListErrorCard
            title="Erro ao carregar home"
            message={errMessage}
            meta={errMeta}
          />
        )}

        {!isInitialLoading && (
          <>
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Visão geral de hoje
              </h2>
              <SalesKpiCards
                kpis={realizedOverview.data?.kpis}
                loading={realizedOverview.isPending}
              />
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Pipeline
              </h2>
              <SalesPipelineCards
                kpis={pipelineOverview.data?.kpis}
                loading={pipelineOverview.isPending}
              />
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Cancelamentos do dia
              </h2>
              <HomeCancelledCards
                data={statusBreakdown.data}
                loading={statusBreakdown.isPending}
              />
            </section>
          </>
        )}
      </div>
    </PaginatedListLayout>
  )
}
