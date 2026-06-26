"use client"

import { useCallback, useMemo } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { getCatalogConfig } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import { NBS_LABELS } from "@/app/(app_routes)/products/catalogs/nbs/_components/nbs-constants"
import { useNbsListFilters } from "@/app/(app_routes)/products/catalogs/nbs/_components/use-nbs-list-filters"
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
import { CardListing } from "@/components/global/listing/card-listing"
import { CatalogCardRows } from "@/app/(app_routes)/products/catalogs/_components/catalog-card-rows"
import { PageHeader } from "@/components/global/structural/page-header"
import { PERMISSION_CODES } from "@/lib/permissions"
import { useProductsNbsQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("nbs")!

export function NbsList() {
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
  } = useNbsListFilters()

  const { data, error, isPending, isFetching, refetch } = useProductsNbsQuery({
    filters: appliedFilters,
    enabled: ready && perms.canConsultNbs && hasSearched,
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
        id: "nbs",
        label: "NBS",
        value: draftFilters.nbs,
        onChange: (value: string) =>
          setDraftFilters((prev) => ({ ...prev, nbs: value })),
        placeholder: "Informe o código NBS",
        ariaLabel: "Código NBS",
      },
      {
        id: "description",
        label: "Descrição",
        value: draftFilters.description,
        onChange: (value: string) =>
          setDraftFilters((prev) => ({ ...prev, description: value })),
        placeholder: "Informe a descrição do NBS",
        ariaLabel: "Descrição do NBS",
      },
    ],
    [draftFilters.description, draftFilters.nbs, setDraftFilters]
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
      perms.canConsultNbs &&
      hasSearched,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    NBS_LABELS.loadListError
  )

  const isSearching = hasSearched && (isFetching || isPending)
  const showStaleBanner = hasSearched && Boolean(error) && Boolean(data)

  return (
    <EnterprisePermissionGuard
      check={(p) => p.canConsultNbs}
      permissionLabel={PERMISSION_CODES.consultarNbsProdutos}
    >
      <PaginatedListLayout>
        <PageHeader title={config.title} subtitle={config.description} />

        <SearchForm
          title="Buscar NBS"
          idPrefix="nbs-filter"
          fields={searchFields}
          onSearch={handleSearch}
          isSearching={isSearching}
          hasSearched={hasSearched}
          appliedValues={{
            nbs: appliedFilters.nbs,
            description: appliedFilters.description,
          }}
          searchLabel="Buscar NBS"
          searchTooltip="Buscar códigos NBS"
          loadingLabel="Carregando NBS..."
        />

        {showStaleBanner && <StaleDataBanner message={errMessage} />}

        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={hasSearched && error && !data ? error : null}
          idleTitle="Nenhuma busca realizada"
          idleHint="Clique em Buscar NBS para listar os registros ou refine pelo código e/ou descrição"
          searchingTitle="Buscando NBS..."
          errorDetails={
            <ListErrorCard
              title={NBS_LABELS.loadListErrorTitle}
              message={errMessage}
              meta={errMeta}
            />
          }
          total={listing.total}
          rangeStart={listing.rangeStart}
          rangeEnd={listing.rangeEnd}
        >
          <CardListing
            items={listing.items}
            total={listing.total}
            limit={listing.limit}
            offset={listing.offset}
            emptyTitle={NBS_LABELS.emptyList}
            emptyHint={NBS_LABELS.emptyListHint}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={clearFilters}
          >
            <CatalogCardRows
              items={listing.items}
              listLabel="Lista de NBS"
              cardTitle={(item) => item.nbs}
              cardSubtitle={(item) => item.description}
            />
          </CardListing>
        </ListingSearchResult>
      </PaginatedListLayout>
    </EnterprisePermissionGuard>
  )
}
