"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { MemberDetailDialog } from "@/app/(app_routes)/members/_components/member-detail-dialog"
import { CreateMemberDialog } from "@/app/(app_routes)/members/_components/create-member-dialog"
import { InviteMemberDialog } from "@/app/(app_routes)/members/_components/invite-member-dialog"
import { MembersListActions } from "@/app/(app_routes)/members/_components/members-list-actions"
import { MembersTableRows } from "@/app/(app_routes)/members/_components/members-table-rows"
import {
  MEMBER_FILTER_FIELDS,
  membersIdleHint,
  membersIdleTitle,
  membersListSubtitle,
  membersListTitle,
  membersSearchingTitle,
} from "@/app/(app_routes)/members/_components/members-constants"
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
import { filterMembersByName } from "@/modules/memberships/memberships-rules"
import { useMembersListFilters } from "@/modules/memberships/use-members-list-filters"
import { useMembersQuery } from "@/modules/memberships/use-members"

type MembersListProps = {
  classValue?: string
}

export function MembersList({ classValue }: MembersListProps) {
  const { ready, enterpriseId, perms } = useEnterprisePermissionAccess()
  const isExplicitSearch = useRef(false)
  const [viewMemberId, setViewMemberId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  const {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    clientNameFilter,
    hasSearched,
    isClientPagination,
    applySearch,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  } = useMembersListFilters({
    class: undefined,
    userId: undefined,
    offset: 0,
    limit: 50,
  })

  const { data, error, isPending, isFetching, refetch } = useMembersQuery({
    enterpriseId,
    filters: appliedFilters,
    enabled:
      ready &&
      perms.isReady &&
      !perms.isError &&
      perms.canConsultMembers &&
      hasSearched,
  })

  const filteredItems = useMemo(() => {
    if (!data) return []
    if (!clientNameFilter) return data.items
    return filterMembersByName(data.items, clientNameFilter)
  }, [data, clientNameFilter])

  const listing = useMemo(() => {
    const limit = appliedFilters.limit ?? data?.limit ?? 50
    const offset = isClientPagination
      ? (appliedFilters.offset ?? 0)
      : (data?.offset ?? 0)
    const total = isClientPagination
      ? filteredItems.length
      : (data?.total ?? 0)
    const items = isClientPagination
      ? filteredItems.slice(offset, offset + limit)
      : filteredItems

    return {
      items,
      total,
      limit,
      offset,
      rangeStart: total === 0 ? 0 : offset + 1,
      rangeEnd: Math.min(offset + limit, total),
    }
  }, [
    appliedFilters.limit,
    appliedFilters.offset,
    data?.limit,
    data?.offset,
    data?.total,
    filteredItems,
    isClientPagination,
  ])

  const searchFields = useMemo(
    () =>
      MEMBER_FILTER_FIELDS.map(
        ({ id, key, label, placeholder, inputMode, numericOnly }) => ({
          id,
          label,
          value: draftFilters[key],
          onChange: (value: string) => {
            const nextValue = numericOnly ? value.replace(/\D/g, "") : value
            setDraftFilters((prev) => ({ ...prev, [key]: nextValue }))
          },
          placeholder,
          ariaLabel: label,
          inputMode,
        })
      ),
    [draftFilters, setDraftFilters]
  )

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

  const handleRefresh = useCallback(() => {
    if (!hasSearched) return
    void refetch()
  }, [hasSearched, refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled:
      ready &&
      perms.isReady &&
      !perms.isError &&
      perms.canConsultMembers &&
      hasSearched,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    "Não foi possível carregar os membros."
  )

  const isSearching = hasSearched && (isFetching || isPending)
  const showStaleBanner = hasSearched && Boolean(error) && Boolean(data)

  const plural = classValue === "clients" ? "clientes" : "membros"
  const isClientsList = classValue === "clients"

  function handleMemberFormSuccess(memberId: string) {
    setCreateOpen(false)
    setInviteOpen(false)
    if (hasSearched) void refetch()
    setViewMemberId(memberId)
  }

  return (
    <EnterprisePermissionGuard
      check={(p) => p.canConsultMembers}
      permissionLabel={PERMISSION_CODES.consultarMembros}
    >
      <PaginatedListLayout>
        <PageHeader
          title={membersListTitle(plural)}
          subtitle={membersListSubtitle(plural)}
          actions={
            <MembersListActions
              isClientsList={isClientsList}
              canCreate={perms.canCreateMemberWithUser}
              canInvite={perms.canCreateMemberWithUser}
              onCreate={() => setCreateOpen(true)}
              onInvite={() => setInviteOpen(true)}
            />
          }
        />

        <SearchForm
          title={`Buscar ${plural}`}
          idPrefix="members-filters-form"
          fields={searchFields}
          onSearch={handleSearch}
          isSearching={isSearching}
          hasSearched={hasSearched}
          appliedValues={{
            code:
              appliedFilters.code != null ? String(appliedFilters.code) : "",
            name: clientNameFilter,
            registration: appliedFilters.registration,
            email: appliedFilters.email,
            phone: appliedFilters.phone,
          }}
          searchLabel={`Buscar ${plural}`}
          searchTooltip={`Buscar ${plural}`}
          loadingLabel={membersSearchingTitle(plural)}
        />

        {showStaleBanner && <StaleDataBanner message={errMessage} />}

        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={hasSearched && error && !data ? error : null}
          idleTitle={membersIdleTitle(plural)}
          idleHint={membersIdleHint(plural)}
          searchingTitle={membersSearchingTitle(plural)}
          errorDetails={
            <ListErrorCard
              title={`Erro ao carregar os ${plural}`}
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
            emptyTitle={`Nenhum ${plural} encontrado`}
            emptyHint={`Ajuste os filtros ou adicione um novo ${plural}.`}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={clearFilters}
          >
            <MembersTableRows
              items={listing.items}
              pluralLabel={plural}
              showClassColumn={true}
              onView={setViewMemberId}
            />
          </TableListing>
        </ListingSearchResult>
      </PaginatedListLayout>

      {!isClientsList && enterpriseId && (
        <>
          <CreateMemberDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            enterpriseId={enterpriseId}
            onSuccess={handleMemberFormSuccess}
          />
          <InviteMemberDialog
            open={inviteOpen}
            onOpenChange={setInviteOpen}
            enterpriseId={enterpriseId}
            onSuccess={handleMemberFormSuccess}
          />
        </>
      )}

      {viewMemberId && (
        <MemberDetailDialog
          memberId={viewMemberId}
          open
          onOpenChange={(open) => {
            if (!open) setViewMemberId(null)
          }}
        />
      )}
    </EnterprisePermissionGuard>
  )
}
