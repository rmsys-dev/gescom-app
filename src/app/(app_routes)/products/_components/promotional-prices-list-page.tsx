"use client"

import { useCallback, useState } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { ProductsListHeader } from "@/app/(app_routes)/products/_components/products-list-header"
import { PromotionalPricesListTable } from "@/app/(app_routes)/products/_components/promotional-prices-list-table"
import { ProductsContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
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
import type { PaginationQuery } from "@/modules/products/products-query"
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import { usePromotionalPricesQuery } from "@/modules/products/use-products"

type PromotionalPricesListPageProps = {
  config: ProductsListRouteConfig
}

export function PromotionalPricesListPage({
  config,
}: PromotionalPricesListPageProps) {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const defaults = config.defaultListFilters() as PaginationQuery
  const [appliedFilters, setAppliedFilters] = useState<PaginationQuery>(defaults)

  const { data, error, isPending, isFetching, refetch } =
    usePromotionalPricesQuery({
      filters: appliedFilters,
      enabled: ready && perms.canConsultPromotionalPrices,
    })

  const tableTotal = data?.total ?? 0
  const tableOffset = data?.offset ?? 0
  const tableLimit = appliedFilters.limit ?? data?.limit ?? 50
  const rangeStart = tableTotal === 0 ? 0 : tableOffset + 1
  const rangeEnd = Math.min(tableOffset + tableLimit, tableTotal)

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((f) => ({ ...f, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setAppliedFilters((f) => ({ ...f, limit, offset: 0 }))
  }, [])

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled:
      ready &&
      perms.isReady &&
      !perms.isError &&
      perms.canConsultPromotionalPrices,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    config.labels.loadListError
  )

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout loading={<ProductsContentLoading />}>
        {null}
      </PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />

  if (!perms.canConsultPromotionalPrices) {
    return (
      <PermissionDeniedCard permissionLabel="consultar_precos_promocionais" />
    )
  }

  return (
    <PaginatedListLayout
      loading={isPending ? <ProductsContentLoading /> : null}
    >
      <RouteBreadcrumb />
      {error && data && <StaleDataBanner message={errMessage} />}
      {error && !data && !isPending && (
        <ListErrorCard
          title={config.labels.loadListErrorTitle}
          message={errMessage}
          meta={errMeta}
        />
      )}
      {data && !isPending && (
        <div className="space-y-6">
          <ProductsListHeader config={config} />

          <p
            className="text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {tableTotal === 1
              ? "1 registro encontrado"
              : `Mostrando ${rangeStart}–${rangeEnd} de ${tableTotal} registros`}
          </p>

          <PromotionalPricesListTable
            items={data.items}
            total={tableTotal}
            limit={tableLimit}
            offset={tableOffset}
            config={config}
            emptyTitle={config.labels.emptyList}
            emptyHint={config.labels.emptyListHint}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
          />
        </div>
      )}
    </PaginatedListLayout>
  )
}
