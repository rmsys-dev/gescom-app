"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HttpError } from "@/lib/api/http-error"
import { CLIENT_MEMBER_CLASS } from "@/modules/memberships/memberships-rules"
import { parseMembershipSearchTerm } from "@/modules/memberships/memberships-rules"
import { MembersFilters } from "@/app/(app_routes)/members/_components/members-filters"
import { MembershipPageHeader } from "@/app/(app_routes)/members/_components/membership-page-header"
import { LinkClientUsersTable } from "@/app/(app_routes)/clients/_components/link-client-users-table"
import { useCreateMemberMutation } from "@/modules/memberships/use-members"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
import type { ListUsersQuery } from "@/modules/users/users.schema"
import {
  defaultUsersListFilters,
  filterUsersByName,
  getNameFromParsedSearch,
  paginateUsers,
  searchTermToUsersQuery,
  usersNameSearchBannerMessage,
} from "@/modules/users/users-rules"
import { useUsersQuery } from "@/modules/users/use-users"
import { MembershipLinkTableLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { StaleDataBanner } from "@/app/(app_routes)/products/_components/paginated-list-shell"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"

const PAGE_SIZE_OPTIONS = [20, 50, 100]

export function LinkClientForm({
  enterpriseId,
  config,
}: {
  enterpriseId: string
  config: MembershipRouteConfig
}) {
  const router = useRouter()
  const linkMutation = useCreateMemberMutation(enterpriseId)
  const [searchTerm, setSearchTerm] = useState("")
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("")
  const [appliedQuery, setAppliedQuery] = useState<ListUsersQuery>(
    defaultUsersListFilters
  )
  const [uiOffset, setUiOffset] = useState(0)
  const [uiLimit, setUiLimit] = useState(50)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [fetchAllPages, setFetchAllPages] = useState(false)
  const [nameSearchWarning, setNameSearchWarning] = useState<string | null>(null)

  const { data, error, isPending, isFetching } = useUsersQuery({
    enterpriseId,
    filters: appliedQuery,
    enabled: searchEnabled,
    fetchAllPages,
  })

  const appliedParsed = useMemo(
    () => parseMembershipSearchTerm(appliedSearchTerm),
    [appliedSearchTerm]
  )
  const appliedNameFilter = getNameFromParsedSearch(appliedParsed)

  const listItems = data?.items
  const filteredItems = useMemo(() => {
    if (!listItems) return []
    return filterUsersByName(listItems, appliedNameFilter)
  }, [listItems, appliedNameFilter])

  const displayedItems = useMemo(
    () => paginateUsers(filteredItems, uiOffset, uiLimit),
    [filteredItems, uiOffset, uiLimit]
  )

  const applySearch = useCallback(() => {
    const {
      query,
      error: validationError,
      searchByName,
      warning,
    } = searchTermToUsersQuery(searchTerm)
    if (validationError) {
      toast.error(validationError)
      return
    }

    setAppliedSearchTerm(searchTerm)
    setAppliedQuery(query)
    setFetchAllPages(Boolean(searchByName))
    setNameSearchWarning(searchByName ? (warning ?? null) : null)
    setUiOffset(0)
    setSelectedUserId(null)
    setSearchEnabled(true)
  }, [searchTerm])

  const clearSearch = useCallback(() => {
    setSearchTerm("")
    setAppliedSearchTerm("")
    setAppliedQuery(defaultUsersListFilters())
    setUiOffset(0)
    setSelectedUserId(null)
    setSearchEnabled(false)
    setFetchAllPages(false)
    setNameSearchWarning(null)
  }, [])

  const handleLimitChange = useCallback((limit: number) => {
    setUiLimit(limit)
    setUiOffset(0)
  }, [])

  async function handleLink() {
    if (!selectedUserId) {
      toast.error(config.link.selectUserError)
      return
    }

    try {
      const member = await linkMutation.mutateAsync({
        userId: selectedUserId,
        class: CLIENT_MEMBER_CLASS,
        departments: [],
      })
      router.push(`${config.basePath}/${member.id}`)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  const listError =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : null

  const errMeta =
    error instanceof HttpError
      ? { code: error.code, status: error.status, requestId: error.requestId }
      : null

  const nameSearchBannerMessage = useMemo(() => {
    if (!nameSearchWarning) return null
    const truncated = Boolean(data && "truncated" in data && data.truncated)
    return usersNameSearchBannerMessage(truncated)
  }, [nameSearchWarning, data])

  const emptyFilters: ListMembersQuery = {}

  return (
    <div className="space-y-6">
      <MembershipPageHeader
        title={config.link.title}
        description={config.link.description}
        note={config.link.note}
      />

      <form
        id={config.link.filtersFormId}
        onSubmit={(e) => {
          e.preventDefault()
          applySearch()
        }}
      >
        <MembersFilters
          filters={emptyFilters}
          onFiltersChange={() => { }}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={applySearch}
          onApplyFilters={() => { }}
          onClear={clearSearch}
          isSearching={isFetching}
          showClassFilter={false}
          showStatusFilter={false}
        />
      </form>

      {!searchEnabled && (
        <p
          role="status"
          className="border border-dashed bg-card px-6 py-8 text-center text-sm text-muted-foreground"
        >
          {config.link.searchHint}
        </p>
      )}

      {searchEnabled && isPending && (
        <MembershipLinkTableLoading
          label={
            fetchAllPages
              ? "A carregar utilizadores…"
              : config.labels.loadingList
          }
        />
      )}

      {searchEnabled && nameSearchBannerMessage && (
        <StaleDataBanner
          title="Busca por nome com limitações"
          message={nameSearchBannerMessage}
          showStaleNote={false}
        />
      )}

      {searchEnabled && error && data && (
        <StaleDataBanner message={listError ?? "Erro desconhecido"} />
      )}

      {searchEnabled && listError && !data && !isPending && (
        <Card className="border-destructive/40 ring-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">
              Erro ao buscar usuários
            </CardTitle>
            <CardDescription>{listError}</CardDescription>
          </CardHeader>
          {errMeta && (
            <CardContent>
              <dl className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                <div>
                  <dt className="font-medium text-foreground">Código</dt>
                  <dd className="font-mono">{errMeta.code}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">HTTP</dt>
                  <dd>{errMeta.status}</dd>
                </div>
                <div className="min-w-0 sm:col-span-1">
                  <dt className="font-medium text-foreground">Request ID</dt>
                  <dd className="truncate font-mono">
                    {errMeta.requestId ?? "—"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          )}
        </Card>
      )}

      {searchEnabled && data && !isPending && (
        <LinkClientUsersTable
          items={displayedItems}
          total={filteredItems.length}
          limit={uiLimit}
          offset={uiOffset}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
          onPageChange={setUiOffset}
          onLimitChange={handleLimitChange}
          onClearFilters={clearSearch}
          nameFilterActive={Boolean(appliedNameFilter.trim())}
          emptyTitle={config.link.emptyList}
          emptyHint={
            appliedNameFilter.trim()
              ? config.link.emptyListHintName
              : config.link.emptyListHint
          }
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />
      )}

      {searchEnabled && isFetching && !isPending && (
        <p className="text-xs text-muted-foreground">Atualizando lista...</p>
      )}

      {searchEnabled && (
        <div className="flex justify-end border-t pt-4">
          <Button
            type="button"
            disabled={linkMutation.isPending || !selectedUserId}
            onClick={() => void handleLink()}
            className="w-full sm:w-auto"
            tooltip={config.link.submitLabel}
          >
            {linkMutation.isPending
              ? config.link.submitPendingLabel
              : config.link.submitLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
