"use client"

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { SalesFilters } from "@/app/(app_routes)/sales/_components/sales-filters"
import { SalesListHeader } from "@/app/(app_routes)/sales/_components/sales-list-header"
import { SalesListTable } from "@/app/(app_routes)/sales/_components/sales-list-table"
import { SalesContentLoading } from "@/app/(app_routes)/sales/_components/sales-route-loading"
import {
  ListErrorCard,
  PaginatedListLayout,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/components/global/listing/paginated-list-shell"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import { filterSalesItemsByDate } from "@/modules/sales/sales-client-filters"
import type { SalesListRouteConfig } from "@/modules/sales/sales-route-config"
import { useSalesListFilters } from "@/modules/sales/use-sales-list-filters"
import { useSalesQuery } from "@/modules/sales/use-sales"

type SalesListPageProps = {
  config: SalesListRouteConfig
  leading?: ReactNode
}

export function SalesListPage({ config, leading }: SalesListPageProps) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const isExplicitSearch = useRef(false)

  const {
    searchTerm,
    setSearchTerm,
    draftFilters,
    setDraftFilters,
    appliedFilters,
    draftDateFilters,
    setDraftDateFilters,
    appliedDateFilters,
    isClientPagination,
    applySearch,
    applyFilters,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  } = useSalesListFilters(config)

  const queryFilters = useMemo(() => {
    if (!isClientPagination) return appliedFilters
    return { ...appliedFilters, offset: 0 }
  }, [appliedFilters, isClientPagination])

  const { data, error, isPending, isFetching, refetch } = useSalesQuery({
    enterpriseId,
    filters: queryFilters,
    enabled: ready && perms.canConsultSales,
  })

  const filteredItems = useMemo(() => {
    if (!data) return []
    return filterSalesItemsByDate(data.items, appliedDateFilters)
  }, [data, appliedDateFilters])

  const tableItems = useMemo(() => {
    if (!isClientPagination) return filteredItems
    const offset = appliedFilters.offset ?? 0
    const limit = appliedFilters.limit ?? data?.limit ?? 20
    return filteredItems.slice(offset, offset + limit)
  }, [
    filteredItems,
    isClientPagination,
    appliedFilters.offset,
    appliedFilters.limit,
    data?.limit,
  ])

  const tableTotal = isClientPagination
    ? filteredItems.length
    : (data?.total ?? 0)
  const tableOffset = isClientPagination
    ? (appliedFilters.offset ?? 0)
    : (data?.offset ?? 0)
  const tableLimit = appliedFilters.limit ?? data?.limit ?? 20

  const rangeStart = tableTotal === 0 ? 0 : tableOffset + 1
  const rangeEnd = Math.min(tableOffset + tableLimit, tableTotal)

  useEffect(() => {
    if (!isExplicitSearch.current) return
    if (isFetching || isPending) return
    if (!data) return
    isExplicitSearch.current = false
    handleSearchResult(isClientPagination ? filteredItems : data.items)
  }, [
    isFetching,
    isPending,
    data,
    filteredItems,
    isClientPagination,
    handleSearchResult,
  ])

  function handleSearch() {
    const ok = applySearch()
    if (ok) isExplicitSearch.current = true
  }

  function handleApplyFilters() {
    const ok = applyFilters()
    if (ok) isExplicitSearch.current = false
  }

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: ready && perms.isReady && !perms.isError && perms.canConsultSales,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    config.labels.loadListError
  )

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout
        loading={<SalesContentLoading config={config} />}
      >
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
      loading={
        isPending ? <SalesContentLoading config={config} /> : null
      }
    >
      {leading}
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
          <SalesListHeader config={config} />
          <form
            id={config.list.filtersFormId}
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
          >
            <SalesFilters
              filters={draftFilters}
              dateFilters={draftDateFilters}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onFiltersChange={setDraftFilters}
              onDateFiltersChange={setDraftDateFilters}
              onSearch={handleSearch}
              onApplyFilters={handleApplyFilters}
              onClear={clearFilters}
              isSearching={isFetching && !isPending}
              showBudgetClosureFilter={config.list.showBudgetClosureFilter}
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
            {isClientPagination && tableTotal > 0
              ? " (resultados filtrados localmente)"
              : ""}
          </p>

          <SalesListTable
            items={tableItems}
            total={tableTotal}
            limit={tableLimit}
            offset={tableOffset}
            enterpriseId={enterpriseId}
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
