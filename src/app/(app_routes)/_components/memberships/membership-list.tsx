"use client"

import { useCallback, useState } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { MembershipDetailDialog } from "@/app/(app_routes)/_components/memberships/membership-detail-dialog"
import { MembershipListActions } from "@/app/(app_routes)/_components/memberships/membership-list-actions"
import { CreateMemberDialog } from "@/app/(app_routes)/members/_components/create-member-dialog"
import { InviteMemberDialog } from "@/app/(app_routes)/members/_components/invite-member-dialog"
import { MembersTableRows } from "@/app/(app_routes)/members/_components/members-table-rows"
import { CreateClientDialog } from "@/app/(app_routes)/clients/_components/create-client-dialog"
import { LinkClientDialog } from "@/app/(app_routes)/clients/_components/link-client-dialog"
import { SearchForm } from "@/components/global/forms/search-form"
import {
  EnterprisePermissionGuard,
  useEnterprisePermissionAccess,
} from "@/components/global/guards/enterprise-permission-guard"
import { ListingSearchResult } from "@/components/global/listing/listing-search-result"
import {
  ListErrorCard,
  PaginatedListLayout,
  StaleDataBanner,
  useListErrorState,
} from "@/components/global/listing/paginated-list-shell"
import { TableListing } from "@/components/global/listing/table-listing"
import { PageHeader } from "@/components/global/structural/page-header"
import { PERMISSION_CODES } from "@/lib/permissions"
import {
  useExplicitSearchRedirect,
  useExplicitSearchRef,
} from "@/modules/memberships/use-explicit-search-redirect"
import type { MembershipRouteConfig } from "@/modules/memberships/memberships-route-config"
import {
  useMembershipListingData,
  useMembershipSearchFields,
} from "@/modules/memberships/use-membership-listing"
import { useMembersListFilters } from "@/modules/memberships/use-members-list-filters"

type MembershipListProps = {
  config: MembershipRouteConfig
}

export function MembershipList({ config }: MembershipListProps) {
  const { ready, enterpriseId, perms } = useEnterprisePermissionAccess()
  const isExplicitSearch = useExplicitSearchRef()
  const [viewId, setViewId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [secondaryOpen, setSecondaryOpen] = useState(false)

  const { labels, list } = config

  const {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    nameFilter,
    hasSearched,
    isLocalPagination,
    applySearch,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  } = useMembersListFilters({
    defaultListFilters: config.defaultListFilters,
    singleResultPath: config.basePath,
  })

  const queryEnabled =
    ready &&
    perms.isReady &&
    !perms.isError &&
    perms.canConsultMembers &&
    hasSearched

  const { data, error, isPending, isFetching, refetch, filteredItems, listing } =
    useMembershipListingData({
      enterpriseId,
      appliedFilters,
      nameFilter,
      isLocalPagination,
      hasSearched,
      enabled: queryEnabled,
    })

  const searchFields = useMembershipSearchFields(
    draftFilters,
    list.filterFields,
    setDraftFilters
  )

  useExplicitSearchRedirect({
    isExplicitSearch,
    isFetching,
    isPending,
    data,
    filteredItems,
    isLocalPagination,
    handleSearchResult,
  })

  function handleSearch() {
    const ok = applySearch()
    if (ok) isExplicitSearch.current = true
  }

  const handleRefresh = useCallback(() => {
    if (!hasSearched) return
    void refetch()
  }, [hasSearched, refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: queryEnabled,
  })

  const { errMessage, errMeta } = useListErrorState(error, labels.loadListError)

  const isSearching = hasSearched && (isFetching || isPending)
  const showStaleBanner = hasSearched && Boolean(error) && Boolean(data)

  function handleFormSuccess(id: string) {
    setCreateOpen(false)
    setSecondaryOpen(false)
    if (hasSearched) void refetch()
    setViewId(id)
  }

  return (
    <EnterprisePermissionGuard
      check={(p) => p.canConsultMembers}
      permissionLabel={PERMISSION_CODES.consultarMembros}
    >
      <PaginatedListLayout>
        <PageHeader
          title={labels.listTitle}
          subtitle={labels.listSubtitle}
          actions={
            <MembershipListActions
              config={config}
              canCreate={perms.canCreateMemberWithUser}
              canSecondary={perms.canCreateMemberWithUser}
              onCreate={() => setCreateOpen(true)}
              onSecondary={() => setSecondaryOpen(true)}
            />
          }
        />

        <SearchForm
          title={labels.searchTitle}
          idPrefix={list.filtersFormId}
          fields={searchFields}
          onSearch={handleSearch}
          isSearching={isSearching}
          hasSearched={hasSearched}
          appliedValues={{
            code:
              appliedFilters.code != null ? String(appliedFilters.code) : "",
            name: nameFilter,
            registration: appliedFilters.registration,
            email: appliedFilters.email,
            phone: appliedFilters.phone,
          }}
          searchLabel={labels.searchLabel}
          searchTooltip={labels.searchLabel}
          loadingLabel={labels.searchingTitle}
        />

        {showStaleBanner && <StaleDataBanner message={errMessage} />}

        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={hasSearched && error && !data ? error : null}
          idleTitle={labels.idleTitle}
          idleHint={labels.idleHint}
          searchingTitle={labels.searchingTitle}
          errorDetails={
            <ListErrorCard
              title={labels.loadListErrorTitle}
              message={errMessage}
              meta={errMeta}
            />
          }
          total={listing.total}
          rangeStart={listing.rangeStart}
          rangeEnd={listing.rangeEnd}
        >
          <TableListing
            items={listing.items}
            total={listing.total}
            limit={listing.limit}
            offset={listing.offset}
            emptyTitle={labels.emptyList}
            emptyHint={labels.emptyListHint}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={clearFilters}
          >
            <MembersTableRows
              items={listing.items}
              pluralLabel={labels.plural}
              showClassColumn={list.showClassColumn}
              onView={setViewId}
            />
          </TableListing>
        </ListingSearchResult>
      </PaginatedListLayout>

      {enterpriseId && (
        <>
          {config.variant === "members" ? (
            <>
              <CreateMemberDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                enterpriseId={enterpriseId}
                onSuccess={handleFormSuccess}
              />
              <InviteMemberDialog
                open={secondaryOpen}
                onOpenChange={setSecondaryOpen}
                enterpriseId={enterpriseId}
                onSuccess={handleFormSuccess}
              />
            </>
          ) : (
            <>
              <CreateClientDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                enterpriseId={enterpriseId}
                onSuccess={handleFormSuccess}
              />
              <LinkClientDialog
                open={secondaryOpen}
                onOpenChange={setSecondaryOpen}
                enterpriseId={enterpriseId}
                onSuccess={handleFormSuccess}
              />
            </>
          )}
        </>
      )}

      {viewId && (
        <MembershipDetailDialog
          membershipId={viewId}
          open
          onOpenChange={(open) => {
            if (!open) setViewId(null)
          }}
          config={config}
        />
      )}
    </EnterprisePermissionGuard>
  )
}
