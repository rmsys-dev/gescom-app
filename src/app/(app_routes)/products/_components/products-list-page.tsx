"use client"

import { useCallback, useEffect, useRef } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { ProductsFilters } from "@/app/(app_routes)/products/_components/products-filters"
import { ProductsListHeader } from "@/app/(app_routes)/products/_components/products-list-header"
import { ProductsListTable } from "@/app/(app_routes)/products/_components/products-list-table"
import { ProductsContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
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
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import { useProductsListFilters } from "@/modules/products/use-products-list-filters"
import { useProductsEnterprisesQuery } from "@/modules/products/use-products"

type ProductsListPageProps = {
  config: ProductsListRouteConfig
}

export function ProductsListPage({ config }: ProductsListPageProps) {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const isExplicitSearch = useRef(false)

  const {
    searchTerm,
    setSearchTerm,
    appliedFilters,
    applySearch,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  } = useProductsListFilters(config)

  const { data, error, isPending, isFetching, refetch } =
    useProductsEnterprisesQuery({
      filters: appliedFilters,
      enabled: ready && perms.canConsultProducts,
    })

  const tableTotal = data?.total ?? 0
  const tableOffset = data?.offset ?? 0
  const tableLimit = appliedFilters.limit ?? data?.limit ?? 50
  const rangeStart = tableTotal === 0 ? 0 : tableOffset + 1
  const rangeEnd = Math.min(tableOffset + tableLimit, tableTotal)

  useEffect(() => {
    if (!isExplicitSearch.current) return
    if (isFetching || isPending) return
    if (!data) return
    isExplicitSearch.current = false
    handleSearchResult(data.items)
  }, [isFetching, isPending, data, handleSearchResult])

  function handleSearch() {
    const ok = applySearch()
    if (ok) isExplicitSearch.current = true
  }

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: ready && perms.isReady && !perms.isError && perms.canConsultProducts,
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

  if (!perms.canConsultProducts) {
    return <PermissionDeniedCard permissionLabel="consultar_produtos" />
  }

  return (
    <PaginatedListLayout
      loading={isPending ? <ProductsContentLoading /> : null}
    >
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
          <form
            id={config.list.filtersFormId}
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
          >
            <ProductsFilters
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onSearch={handleSearch}
              onClear={clearFilters}
              isSearching={isFetching && !isPending}
            />
          </form>

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

          <ProductsListTable
            items={data.items}
            total={tableTotal}
            limit={tableLimit}
            offset={tableOffset}
            config={config}
            emptyTitle={config.labels.emptyList}
            emptyHint={config.labels.emptyListHint}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={clearFilters}
          />
        </div>
      )}
    </PaginatedListLayout>
  )
}
