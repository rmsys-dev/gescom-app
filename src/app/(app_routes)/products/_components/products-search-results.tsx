"use client"

import { Loader2, Search, SearchX } from "lucide-react"

import { ProductsListTable } from "@/app/(app_routes)/products/_components/products-list-table"
import { ListErrorCard } from "@/app/(app_routes)/products/_components/paginated-list-shell"
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import type { ProductEnterprise } from "@/modules/products/products.schema"

type ProductsSearchResultsProps = {
  hasSearched: boolean
  isSearching: boolean
  error: unknown
  errorTitle: string
  errorMessage: string
  errorMeta: {
    code: string
    status: number
    requestId: string | null
  } | null
  items: ProductEnterprise[]
  total: number
  limit: number
  offset: number
  rangeStart: number
  rangeEnd: number
  config: ProductsListRouteConfig
  emptyTitle: string
  emptyHint: string
  onPageChange: (offset: number) => void
  onLimitChange: (limit: number) => void
  onClearFilters: () => void
  isClientPagination?: boolean
}

export function ProductsSearchResults({
  hasSearched,
  isSearching,
  error,
  errorTitle,
  errorMessage,
  errorMeta,
  items,
  total,
  limit,
  offset,
  rangeStart,
  rangeEnd,
  config,
  emptyTitle,
  emptyHint,
  onPageChange,
  onLimitChange,
  onClearFilters,
  isClientPagination = false,
}: ProductsSearchResultsProps) {
  if (!hasSearched) {
    return (
      <div
        role="status"
        className="border bg-card px-6 py-20 text-center"
      >
        <Search
          className="mx-auto mb-4 size-12 text-muted-foreground/30"
          aria-hidden
        />
        <p className="font-semibold text-foreground">Nenhuma busca realizada</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Use os campos acima e clique em Buscar para ver os resultados
        </p>
      </div>
    )
  }

  if (isSearching) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center border bg-card px-6 py-20 text-center"
      >
        <Loader2
          className="mb-4 size-10 animate-spin text-muted-foreground"
          aria-hidden
        />
        <p className="font-semibold text-foreground">Buscando produtos...</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Aguarde enquanto consultamos os registros
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div
          role="status"
          className="border border-dashed bg-card px-6 py-12 text-center"
        >
          <SearchX
            className="mx-auto mb-4 size-10 text-muted-foreground/40"
            aria-hidden
          />
          <p className="font-semibold text-foreground">
            Não foi possível concluir a busca
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Verifique os filtros informados e tente novamente
          </p>
        </div>
        <ListErrorCard
          title={errorTitle}
          message={errorMessage}
          meta={errorMeta}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p
        className="text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {total === 1
          ? "1 registro encontrado"
          : `Mostrando ${rangeStart}–${rangeEnd} de ${total} registros`}
        {isClientPagination && total > 0
          ? " (resultados filtrados localmente)"
          : ""}
      </p>

      <ProductsListTable
        items={items}
        total={total}
        limit={limit}
        offset={offset}
        config={config}
        emptyTitle={emptyTitle}
        emptyHint={emptyHint}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        onClearFilters={onClearFilters}
      />
    </div>
  )
}
