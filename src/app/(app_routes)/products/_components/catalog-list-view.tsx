"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
import { ArrowLeft } from "lucide-react"
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
import { PRODUCTS_BASE_PATH } from "@/app/(app_routes)/products/_components/products-constants"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
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

  const [draftFilters, setDraftFilters] = useState<
    PaginationQuery | ListProductNbsQuery
  >(initialFilters)
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

  const applyFilters = useCallback(() => {
    const searchValue =
      "search" in draftFilters && typeof draftFilters.search === "string"
        ? draftFilters.search
        : undefined
    const rawSearch =
      config.supportsSearch && searchValue !== undefined
        ? searchValue.trim()
        : undefined
    if (rawSearch !== undefined && rawSearch.length === 0) {
      toast.error("A pesquisa deve ter pelo menos 1 caractere.")
      return
    }
    const search = rawSearch && rawSearch.length > 0 ? rawSearch : undefined
    setAppliedFilters({
      ...draftFilters,
      offset: 0,
      search,
    } as typeof appliedFilters)
  }, [config.supportsSearch, draftFilters])

  const clearFilters = useCallback(() => {
    setDraftFilters(initialFilters)
    setAppliedFilters(initialFilters)
  }, [initialFilters])

  const { errMessage, errMeta } = useListErrorState(
    error,
    `Não foi possível carregar ${config.title.toLowerCase()}.`
  )

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
                <div className="flex items-start gap-3">
                  <Button variant="ghost" size="icon" asChild className="shrink-0">
                    <Link href={`${PRODUCTS_BASE_PATH}/catalogs`} aria-label="Voltar">
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                      {config.title}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {config.description} · {data.total} registo(s)
                    </p>
                  </div>
                </div>
              </div>

              {config.supportsSearch && (
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <Field>
                    <FieldLabel htmlFor="catalog-search">Pesquisa</FieldLabel>
                    <Input
                      id="catalog-search"
                      value={
                        config.supportsSearch &&
                        "search" in draftFilters &&
                        typeof draftFilters.search === "string"
                          ? draftFilters.search
                          : ""
                      }
                      onChange={(e) =>
                        setDraftFilters({
                          ...draftFilters,
                          search: e.target.value || undefined,
                        } as ListProductNbsQuery)
                      }
                    />
                  </Field>
                  <div className="mt-4 flex gap-2">
                    <Button type="button" onClick={applyFilters}>
                      Aplicar
                    </Button>
                    <Button type="button" variant="outline" onClick={clearFilters}>
                      Limpar
                    </Button>
                  </div>
                </div>
              )}

              <PaginatedResourceTable
                items={data.items}
                total={data.total}
                limit={data.limit}
                offset={data.offset}
                onPageChange={(offset) =>
                  setAppliedFilters((f) => ({ ...f, offset }))
                }
                basePath={config.basePath}
                emptyTitle="Nenhum registo encontrado"
                emptyDescription="Não há itens neste catálogo."
                columns={columns}
                mobileTitle={mobileTitle}
                mobileSubtitle={mobileSubtitle}
              />
            </div>
          )}
    </PaginatedListLayout>
  )
}
