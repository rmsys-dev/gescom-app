"use client"

import { useCallback, useMemo } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import type { CatalogConfig } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import {
  CatalogCardRows,
  type CatalogCardField,
} from "@/app/(app_routes)/products/catalogs/_components/catalog-card-rows"
import {
  CatalogTableRows,
  type CatalogColumn,
} from "@/app/(app_routes)/products/catalogs/_components/catalog-table-rows"
import { useCatalogListFilters } from "@/app/(app_routes)/products/catalogs/_components/use-catalog-list-filters"
import {
  ListErrorCard,
  PaginatedListLayout,
  StaleDataBanner,
  useListErrorState,
} from "@/components/global/listing/paginated-list-shell"
import {
  EnterprisePermissionGuard,
  useEnterprisePermissionAccess,
} from "@/components/global/guards/enterprise-permission-guard"
import { ListingSearchResult } from "@/components/global/listing/listing-search-result"
import { CardListing } from "@/components/global/listing/card-listing"
import { TableListing } from "@/components/global/listing/table-listing"
import { PageHeader } from "@/components/global/structural/page-header"
import type { OperatorPermissions } from "@/components/global/guards/permission-route-guard"
import type { PaginationQuery } from "@/modules/products/products-query"

type ListHookResult<T> = {
  data:
    | { items: T[]; total: number; limit: number; offset: number }
    | undefined
  error: unknown
  isPending: boolean
  isFetching: boolean
  refetch: () => void
}

type CatalogListViewProps<T extends { id: string }> = {
  config: CatalogConfig
  layout?: "table" | "card"
  columns?: CatalogColumn<T>[]
  cardTitle?: (item: T) => string
  cardSubtitle?: (item: T) => string
  cardFields?: CatalogCardField<T>[]
  mobileTitle: (item: T) => string
  mobileSubtitle?: (item: T) => string
  useListData: (opts: {
    filters: PaginationQuery
    enabled: boolean
  }) => ListHookResult<T>
}

function canConsultCatalog(
  perms: OperatorPermissions,
  permissionKey: CatalogConfig["permissionKey"]
) {
  return perms[permissionKey]
}

export function CatalogListView<T extends { id: string }>({
  config,
  layout = "table",
  columns = [],
  cardTitle,
  cardSubtitle,
  cardFields,
  mobileTitle,
  mobileSubtitle,
  useListData,
}: CatalogListViewProps<T>) {
  const { ready, perms } = useEnterprisePermissionAccess()
  const canConsult = canConsultCatalog(perms, config.permissionKey)

  const {
    appliedFilters,
    clearFilters,
    setPageOffset,
    setLimit,
  } = useCatalogListFilters()

  const { data, error, isPending, isFetching, refetch } = useListData({
    filters: appliedFilters,
    enabled: ready && canConsult,
  })

  const listing = useMemo(() => {
    const limit = appliedFilters.limit ?? data?.limit ?? 50
    const offset = data?.offset ?? appliedFilters.offset ?? 0
    const total = data?.total ?? 0
    const items = data?.items ?? []

    return {
      items,
      total,
      limit,
      offset,
      rangeStart: total === 0 ? 0 : offset + 1,
      rangeEnd: Math.min(offset + limit, total),
    }
  }, [appliedFilters.limit, appliedFilters.offset, data])

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: ready && perms.isReady && !perms.isError && canConsult,
  })

  const loadListError = `Não foi possível carregar ${config.title.toLowerCase()}.`
  const { errMessage, errMeta } = useListErrorState(error, loadListError)

  const isSearching = isFetching || isPending
  const showStaleBanner = Boolean(error) && Boolean(data)
  const hasSearched = true

  return (
    <EnterprisePermissionGuard
      check={(p) => canConsultCatalog(p, config.permissionKey)}
      permissionLabel={config.permissionLabel}
    >
      <PaginatedListLayout>
        <PageHeader title={config.title} subtitle={config.description} />

        {showStaleBanner && <StaleDataBanner message={errMessage} />}

        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={error && !data ? error : null}
          searchingTitle={`Carregando ${config.title.toLowerCase()}...`}
          errorDetails={
            <ListErrorCard
              title={`Erro ao carregar ${config.title.toLowerCase()}`}
              message={errMessage}
              meta={errMeta}
            />
          }
          total={listing.total}
          rangeStart={listing.rangeStart}
          rangeEnd={listing.rangeEnd}
        >
          {layout === "card" ? (
            <CardListing
              items={listing.items}
              total={listing.total}
              limit={listing.limit}
              offset={listing.offset}
              emptyTitle="Nenhum registro encontrado"
              emptyHint="Não há itens neste catálogo."
              onPageChange={setPageOffset}
              onLimitChange={setLimit}
              onClearFilters={clearFilters}
            >
              <CatalogCardRows
                items={listing.items}
                listLabel={`Lista de ${config.title.toLowerCase()}`}
                cardTitle={cardTitle ?? mobileTitle}
                cardSubtitle={cardSubtitle ?? mobileSubtitle}
                fields={cardFields}
              />
            </CardListing>
          ) : (
            <TableListing
              items={listing.items}
              total={listing.total}
              limit={listing.limit}
              offset={listing.offset}
              emptyTitle="Nenhum registro encontrado"
              emptyHint="Não há itens neste catálogo."
              onPageChange={setPageOffset}
              onLimitChange={setLimit}
              onClearFilters={clearFilters}
            >
              <CatalogTableRows
                items={listing.items}
                columns={columns}
                listLabel={`Lista de ${config.title.toLowerCase()}`}
                mobileTitle={mobileTitle}
                mobileSubtitle={mobileSubtitle}
              />
            </TableListing>
          )}
        </ListingSearchResult>
      </PaginatedListLayout>
    </EnterprisePermissionGuard>
  )
}
