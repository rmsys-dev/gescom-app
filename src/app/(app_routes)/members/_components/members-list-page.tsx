"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { MembersFilters } from "@/app/(app_routes)/members/_components/members-filters"
import { MembersListHeader } from "@/app/(app_routes)/members/_components/members-list-header"
import { MembershipContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { MembersTable } from "@/app/(app_routes)/members/_components/members-table"
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
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
import { filterMembersByName } from "@/modules/memberships/memberships-rules"
import { useMembersListFilters } from "@/modules/memberships/use-members-list-filters"
import { useMembersQuery } from "@/modules/memberships/use-members"

export function MembersListPage({
  config,
}: {
  config: MembershipRouteConfig
}) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const {
    searchTerm,
    setSearchTerm,
    clientNameFilter,
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applySearch,
    applyFilters,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  } = useMembersListFilters(config)

  const isExplicitSearch = useRef(false)

  const { data, error, isPending, isFetching, refetch } = useMembersQuery({
    enterpriseId,
    filters: appliedFilters,
    enabled: ready && perms.canConsultMembers,
  })

  const isClientPagination = Boolean(clientNameFilter)

  const filteredItems = useMemo(() => {
    if (!data) return []
    if (!clientNameFilter) return data.items
    return filterMembersByName(data.items, clientNameFilter)
  }, [data, clientNameFilter])

  const tableItems = useMemo(() => {
    if (!isClientPagination) return filteredItems
    const offset = appliedFilters.offset ?? 0
    const limit = appliedFilters.limit ?? data?.limit ?? 50
    return filteredItems.slice(offset, offset + limit)
  }, [
    filteredItems,
    isClientPagination,
    appliedFilters.offset,
    appliedFilters.limit,
    data?.limit,
  ])

  const tableTotal = isClientPagination ? filteredItems.length : (data?.total ?? 0)
  const tableOffset = isClientPagination
    ? (appliedFilters.offset ?? 0)
    : (data?.offset ?? 0)
  const tableLimit = appliedFilters.limit ?? data?.limit ?? 50

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
    enabled: ready && perms.isReady && !perms.isError && perms.canConsultMembers,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    config.labels.loadListError
  )

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout
        loading={<MembershipContentLoading config={config} />}
      >
        {null}
      </PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />

  if (!perms.canConsultMembers) {
    return <PermissionDeniedCard permissionLabel="consultar_membros" />
  }

  return (
    <PaginatedListLayout
      loading={
        isPending ? <MembershipContentLoading config={config} /> : null
      }
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
          <MembersListHeader config={config} perms={perms} />
          <form
            id={config.list.filtersFormId}
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
          >
            <MembersFilters
              filters={draftFilters}
              onFiltersChange={setDraftFilters}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onSearch={handleSearch}
              onApplyFilters={handleApplyFilters}
              onClear={clearFilters}
              isSearching={isFetching && !isPending}
              showClassFilter={config.list.showClassFilter}
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

          <MembersTable
            items={tableItems}
            total={tableTotal}
            limit={tableLimit}
            offset={tableOffset}
            basePath={config.basePath}
            config={config}
            showClassColumn={config.list.showClassColumn}
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
