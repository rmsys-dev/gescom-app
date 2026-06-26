"use client"

import { useCallback, useMemo } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { getProductResourceConfig } from "@/app/(app_routes)/products/catalogs/_components/product-resource-config"
import { BrandsTableRows } from "@/app/(app_routes)/products/brands/_components/brands-table-rows"
import { BRANDS_LABELS } from "@/app/(app_routes)/products/brands/_components/brands-constants"
import { useBrandsListFilters } from "@/app/(app_routes)/products/brands/_components/use-brands-list-filters"
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
import { useProductBrandsQuery } from "@/modules/products/use-products"

const config = getProductResourceConfig("brands")!

export function BrandsList() {
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
  } = useBrandsListFilters()

  const { data, error, isPending, isFetching, refetch } = useProductBrandsQuery({
    filters: appliedFilters,
    enabled: ready && perms.canConsultProductBrands && hasSearched,
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
        id: "description",
        label: "Descrição",
        value: draftFilters.description,
        onChange: (value: string) =>
          setDraftFilters((prev) => ({ ...prev, description: value })),
        placeholder: "Informe a descrição da marca",
        ariaLabel: "Descrição da marca",
      },
    ],
    [draftFilters.description, setDraftFilters]
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
      perms.canConsultProductBrands &&
      hasSearched,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    BRANDS_LABELS.loadListError
  )

  const isSearching = hasSearched && (isFetching || isPending)
  const showStaleBanner = hasSearched && Boolean(error) && Boolean(data)

  return (
    <EnterprisePermissionGuard
      check={(p) => p.canConsultProductBrands}
      permissionLabel={PERMISSION_CODES.consultarMarcasProduto}
    >
      <PaginatedListLayout>
        <PageHeader title={config.title} subtitle={config.description} />

        <SearchForm
          title="Buscar marca"
          idPrefix="brands-filter"
          fields={searchFields}
          onSearch={handleSearch}
          isSearching={isSearching}
          hasSearched={hasSearched}
          appliedValues={{
            description: appliedFilters.description,
          }}
          searchLabel="Buscar marcas"
          searchTooltip="Buscar marcas de produto"
          loadingLabel="Carregando marcas..."
        />

        {showStaleBanner && <StaleDataBanner message={errMessage} />}

        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={hasSearched && error && !data ? error : null}
          idleTitle="Nenhuma busca realizada"
          idleHint="Clique em Buscar marcas para listar os registros ou refine pela descrição"
          searchingTitle="Buscando marcas..."
          errorDetails={
            <ListErrorCard
              title={BRANDS_LABELS.loadListErrorTitle}
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
            emptyTitle={BRANDS_LABELS.emptyList}
            emptyHint={BRANDS_LABELS.emptyListHint}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={clearFilters}
          >
            <BrandsTableRows
              items={listing.items}
              pluralLabel={BRANDS_LABELS.plural}
            />
          </TableListing>
        </ListingSearchResult>
      </PaginatedListLayout>
    </EnterprisePermissionGuard>
  )
}
