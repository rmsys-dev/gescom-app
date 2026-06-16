"use client"

import { useCallback, useState } from "react"
import { Loader2, Search, X } from "lucide-react"
import { toast } from "sonner"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import {
  DEFAULT_CATALOG_FILTERS,
  DEFAULT_NBS_FILTERS,
  type CatalogConfig,
} from "@/app/(app_routes)/products/_components/catalog-config"
import {
  PaginatedListLayout,
  ListErrorCard,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import {
  PaginatedResourceTable,
  type ResourceColumn,
} from "@/app/(app_routes)/products/_components/paginated-resource-table"
import { ProductsContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useOperatorPermissions } from "@/lib/permissions"
import type { PaginationQuery } from "@/modules/products/products-query"
import type { ListProductNbsQuery } from "@/modules/products/products-catalogs.schema"

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
  columns: ResourceColumn<T>[]
  mobileTitle: (item: T) => string
  mobileSubtitle?: (item: T) => string
  useListData: (opts: {
    filters: PaginationQuery | ListProductNbsQuery
    enabled: boolean
  }) => ListHookResult<T>
}

export function CatalogListView<T extends { id: string }>({
  config,
  columns,
  mobileTitle,
  mobileSubtitle,
  useListData,
}: CatalogListViewProps<T>) {
  const perms = useOperatorPermissions()
  const canConsult = perms[config.permissionKey]

  const initialFilters = config.supportsSearch
    ? DEFAULT_NBS_FILTERS
    : DEFAULT_CATALOG_FILTERS

  const [searchTerm, setSearchTerm] = useState("")
  const [appliedFilters, setAppliedFilters] = useState<
    PaginationQuery | ListProductNbsQuery
  >(initialFilters)

  const { data, error, isPending, isFetching, refetch } = useListData({
    filters: appliedFilters,
    enabled: perms.isReady && canConsult,
  })

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: perms.isReady && !perms.isError && canConsult,
  })

  const applySearch = useCallback(() => {
    if (!config.supportsSearch) return
    const search = searchTerm.trim()
    if (search.length > 0 && search.length < 1) {
      toast.error("A pesquisa deve ter pelo menos 1 caractere.")
      return
    }
    setAppliedFilters({
      ...appliedFilters,
      offset: 0,
      search: search.length > 0 ? search : undefined,
    } as typeof appliedFilters)
  }, [config.supportsSearch, searchTerm, appliedFilters])

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setAppliedFilters(initialFilters)
  }, [initialFilters])

  const { errMessage, errMeta } = useListErrorState(
    error,
    `Não foi possível carregar ${config.title.toLowerCase()}.`
  )

  const tableTotal = data?.total ?? 0
  const tableOffset = data?.offset ?? 0
  const tableLimit = appliedFilters.limit ?? data?.limit ?? 50
  const rangeStart = tableTotal === 0 ? 0 : tableOffset + 1
  const rangeEnd = Math.min(tableOffset + tableLimit, tableTotal)

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((f) => ({ ...f, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setAppliedFilters((f) => ({ ...f, limit, offset: 0 }))
  }, [])

  if (!perms.isReady) {
    return (
      <PaginatedListLayout loading={<ProductsContentLoading />}>{null}</PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />
  if (!canConsult) {
    return <PermissionDeniedCard permissionLabel={config.permissionLabel} />
  }

  return (
    <PaginatedListLayout loading={isPending ? <ProductsContentLoading /> : null}>
      {Boolean(error) && data && <StaleDataBanner message={errMessage} />}
      {Boolean(error) && !data && !isPending && (
        <ListErrorCard
          title={`Erro ao carregar ${config.title.toLowerCase()}`}
          message={errMessage}
          meta={errMeta}
        />
      )}
      {data && !isPending && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <RouteBreadcrumb />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {config.title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {config.description}
                </p>
              </div>
            </div>
          </div>

          {config.supportsSearch && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                applySearch()
              }}
            >
              <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Busca
                  </p>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id="catalog-search"
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          applySearch()
                        }
                      }}
                      placeholder="Pesquisar NBS"
                      className="pl-9 pr-9"
                      disabled={isFetching && !isPending}
                      aria-label="Pesquisar NBS"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Limpar busca"
                        disabled={isFetching && !isPending}
                      >
                        <X className="size-4" aria-hidden />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={applySearch}
                    disabled={isFetching && !isPending}
                    tooltip="Buscar NBS"
                  >
                    {isFetching && !isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="size-4" aria-hidden />
                        Buscar
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    disabled={isFetching && !isPending}
                    tooltip="Limpar filtros"
                  >
                    <X className="size-4" aria-hidden />
                    Limpar
                  </Button>
                </div>
              </div>
            </form>
          )}

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

          <PaginatedResourceTable
            items={data.items}
            total={tableTotal}
            limit={tableLimit}
            offset={tableOffset}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={config.supportsSearch ? clearFilters : undefined}
            emptyTitle="Nenhum registro encontrado"
            emptyDescription="Não há itens neste catálogo."
            columns={columns}
            mobileTitle={mobileTitle}
            mobileSubtitle={mobileSubtitle}
            listLabel={`Lista de ${config.title.toLowerCase()}`}
          />
        </div>
      )}
    </PaginatedListLayout>
  )
}
