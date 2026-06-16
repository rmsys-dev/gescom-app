"use client"

import { useCallback, useState } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import {
  PaginatedListLayout,
  ListErrorCard,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import {
  PaginatedResourceGrid,
  type ResourceCardField,
} from "@/app/(app_routes)/products/_components/paginated-resource-grid"
import {
  PaginatedResourceTable,
  type ResourceColumn,
} from "@/app/(app_routes)/products/_components/paginated-resource-table"
import { ProductsContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import type { PaginationQuery } from "@/modules/products/products-query"

const DEFAULT_LIMIT = 50

type ListHookResult<T> = {
  data: { items: T[]; total: number; limit: number; offset: number } | undefined
  error: unknown
  isPending: boolean
  isFetching: boolean
  refetch: () => void
}

type TenantResourceListViewProps<T extends { id: string }> = {
  title: string
  description: string
  permissionLabel: string
  canConsult: boolean
  layout?: "table" | "grid"
  columns?: ResourceColumn<T>[]
  cardTitle?: (item: T) => string
  cardFields?: ResourceCardField<T>[]
  mobileTitle?: (item: T) => string
  mobileSubtitle?: (item: T) => string
  emptyTitle?: string
  emptyHint?: string
  useListData: (opts: {
    filters: PaginationQuery
    enabled: boolean
  }) => ListHookResult<T>
}

export function TenantResourceListView<T extends { id: string }>({
  title,
  description,
  permissionLabel,
  canConsult,
  layout = "table",
  columns = [],
  cardTitle,
  cardFields,
  mobileTitle,
  mobileSubtitle,
  emptyTitle = "Nenhum registro encontrado",
  emptyHint = "Não há itens para listar.",
  useListData,
}: TenantResourceListViewProps<T>) {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const [appliedFilters, setAppliedFilters] = useState<PaginationQuery>({
    limit: DEFAULT_LIMIT,
    offset: 0,
  })

  const { data, error, isPending, isFetching, refetch } = useListData({
    filters: appliedFilters,
    enabled: ready && perms.isReady && canConsult,
  })

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: ready && perms.isReady && !perms.isError && canConsult,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    `Não foi possível carregar ${title.toLowerCase()}.`
  )

  const tableTotal = data?.total ?? 0
  const tableOffset = data?.offset ?? 0
  const tableLimit = appliedFilters.limit ?? data?.limit ?? DEFAULT_LIMIT
  const rangeStart = tableTotal === 0 ? 0 : tableOffset + 1
  const rangeEnd = Math.min(tableOffset + tableLimit, tableTotal)

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((f) => ({ ...f, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setAppliedFilters((f) => ({ ...f, limit, offset: 0 }))
  }, [])

  const resolvedCardTitle = cardTitle ?? mobileTitle ?? (() => "")

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout loading={<ProductsContentLoading />}>{null}</PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />
  if (!canConsult) {
    return <PermissionDeniedCard permissionLabel={permissionLabel} />
  }

  return (
    <PaginatedListLayout loading={isPending ? <ProductsContentLoading /> : null}>
      {Boolean(error) && data && <StaleDataBanner message={errMessage} />}
      {Boolean(error) && !data && !isPending && (
        <ListErrorCard
          title={`Erro ao carregar ${title.toLowerCase()}`}
          message={errMessage}
          meta={errMeta}
        />
      )}
      {data && !isPending && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <RouteBreadcrumb />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>

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

          {layout === "grid" ? (
            <PaginatedResourceGrid
              items={data.items}
              total={tableTotal}
              limit={tableLimit}
              offset={tableOffset}
              onPageChange={setPageOffset}
              onLimitChange={setLimit}
              emptyTitle={emptyTitle}
              emptyDescription={emptyHint}
              cardTitle={resolvedCardTitle}
              cardFields={cardFields}
              listLabel={`Lista de ${title.toLowerCase()}`}
            />
          ) : (
            <PaginatedResourceTable
              items={data.items}
              total={tableTotal}
              limit={tableLimit}
              offset={tableOffset}
              onPageChange={setPageOffset}
              onLimitChange={setLimit}
              emptyTitle={emptyTitle}
              emptyDescription={emptyHint}
              columns={columns}
              mobileTitle={mobileTitle ?? resolvedCardTitle}
              mobileSubtitle={mobileSubtitle}
              listLabel={`Lista de ${title.toLowerCase()}`}
            />
          )}
        </div>
      )}
    </PaginatedListLayout>
  )
}
