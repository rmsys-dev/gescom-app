"use client"

import { useCallback, useMemo } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { getCatalogConfig } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import { CatalogTableRows } from "@/app/(app_routes)/products/catalogs/_components/catalog-table-rows"
import { CEST_LABELS } from "@/app/(app_routes)/products/catalogs/cest/_components/cest-constants"
import { useCestListFilters } from "@/app/(app_routes)/products/catalogs/cest/_components/use-cest-list-filters"
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
import { SearchForm } from "@/components/global/forms/search-form"
import { ListingSearchResult } from "@/components/global/listing/listing-search-result"
import { TableListing } from "@/components/global/listing/table-listing"
import { PageHeader } from "@/components/global/structural/page-header"
import { PERMISSION_CODES } from "@/lib/permissions"
import { useProductsCestQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("cest")!

export function CestList() {
  const { ready, perms } = useEnterprisePermissionAccess()

  const {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    hasSearched,
    applySearch,
    clearFilters,
    setPageOffset,
    setLimit,
  } = useCestListFilters()

  const { data, error, isPending, isFetching, refetch } = useProductsCestQuery({
    filters: appliedFilters,
    enabled: ready && perms.canConsultCest && hasSearched,
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

  const searchFields = useMemo(
    () => [
      {
        id: "cest",
        label: "CEST",
        value: draftFilters.cest,
        onChange: (value: string) =>
          setDraftFilters((prev) => ({ ...prev, cest: value })),
        placeholder: "Informe o código CEST",
        ariaLabel: "Código CEST",
      },
      {
        id: "description",
        label: "Descrição",
        value: draftFilters.description,
        onChange: (value: string) =>
          setDraftFilters((prev) => ({ ...prev, description: value })),
        placeholder: "Informe a descrição do CEST",
        ariaLabel: "Descrição do CEST",
      },
    ],
    [draftFilters.description, draftFilters.cest, setDraftFilters]
  )

  function handleSearch() {
    applySearch()
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
      perms.canConsultCest &&
      hasSearched,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    CEST_LABELS.loadListError
  )

  const isSearching = hasSearched && (isFetching || isPending)
  const showStaleBanner = hasSearched && Boolean(error) && Boolean(data)

  return (
    <EnterprisePermissionGuard
      check={(p) => p.canConsultCest}
      permissionLabel={PERMISSION_CODES.consultarCestProdutos}
    >
      <PaginatedListLayout>
        <PageHeader title={config.title} subtitle={config.description} />

        <SearchForm
          title="Buscar CEST"
          idPrefix="cest-filter"
          fields={searchFields}
          onSearch={handleSearch}
          isSearching={isSearching}
          hasSearched={hasSearched}
          appliedValues={{
            cest: appliedFilters.cest,
            description: appliedFilters.description,
          }}
          searchLabel="Buscar CEST"
          searchTooltip="Buscar códigos CEST"
          loadingLabel="Carregando CEST..."
        />

        {showStaleBanner && <StaleDataBanner message={errMessage} />}

        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={hasSearched && error && !data ? error : null}
          idleTitle="Nenhuma busca realizada"
          idleHint="Clique em Buscar CEST para listar os registros ou refine pelo código e/ou descrição"
          searchingTitle="Buscando CEST..."
          errorDetails={
            <ListErrorCard
              title={CEST_LABELS.loadListErrorTitle}
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
            emptyTitle={CEST_LABELS.emptyList}
            emptyHint={CEST_LABELS.emptyListHint}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={clearFilters}
          >
            <CatalogTableRows
              items={listing.items}
              columns={[
                { header: "CEST", cell: (item) => item.cest },
                { header: "Descrição", cell: (item) => item.description },
              ]}
              listLabel="Lista de CEST"
              mobileTitle={(item) => item.description}
              mobileSubtitle={(item) => item.cest}
            />
          </TableListing>
        </ListingSearchResult>
      </PaginatedListLayout>
    </EnterprisePermissionGuard>
  )
}
