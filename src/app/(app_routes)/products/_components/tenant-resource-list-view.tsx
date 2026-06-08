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
  basePath: string
  columns: ResourceColumn<T>[]
  mobileTitle: (item: T) => string
  mobileSubtitle?: (item: T) => string
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
  basePath,
  columns,
  mobileTitle,
  mobileSubtitle,
  useListData,
}: TenantResourceListViewProps<T>) {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const [filters, setFilters] = useState<PaginationQuery>({
    limit: DEFAULT_LIMIT,
    offset: 0,
  })

  const { data, error, isPending, isFetching, refetch } = useListData({
    filters,
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
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description} · {data.total} registo(s)
                    </p>
                  </div>
                </div>
              </div>
              <PaginatedResourceTable
                items={data.items}
                total={data.total}
                limit={data.limit}
                offset={data.offset}
                onPageChange={(offset) => setFilters((f) => ({ ...f, offset }))}
                basePath={basePath}
                emptyTitle="Nenhum registo encontrado"
                emptyDescription="Não há itens para listar."
                columns={columns}
                mobileTitle={mobileTitle}
                mobileSubtitle={mobileSubtitle}
              />
            </div>
          )}
    </PaginatedListLayout>
  )
}
