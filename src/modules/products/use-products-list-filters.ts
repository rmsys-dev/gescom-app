"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  defaultProductsDateFilters,
  defaultProductsDraftFilters,
  PRODUCTS_CLIENT_SEARCH_LIMIT,
  type ProductsDateFilters,
  type ProductsDraftFilters,
  type ProductsInlineSearchField,
} from "@/app/(app_routes)/products/_components/products-constants"
import type { ProductsClientFilterCriteria } from "@/modules/products/products-client-filters"
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import type { ListProductsEnterprisesQuery } from "@/modules/products/products.schema"

function validateDateRange(dateFilters: ProductsDateFilters): boolean {
  const dateFrom = dateFilters.dateFrom?.trim()
  const dateTo = dateFilters.dateTo?.trim()
  if (dateFrom && dateTo && dateFrom > dateTo) {
    toast.error("A data inicial não pode ser posterior à data final.")
    return false
  }
  return true
}

function parseCode(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  if (!Number.isInteger(parsed) || parsed <= 0) return undefined
  return parsed
}

function hasAnySearchCriteria(
  draft: ProductsDraftFilters,
  dateFilters: ProductsDateFilters
): boolean {
  return (
    draft.code.trim().length > 0 ||
    draft.description.trim().length > 0 ||
    draft.barCode.trim().length > 0 ||
    draft.manufacturer.trim().length > 0 ||
    draft.origin.trim().length > 0 ||
    draft.group.trim().length > 0 ||
    draft.subgroup.trim().length > 0 ||
    draft.brand.trim().length > 0 ||
    draft.application.trim().length > 0 ||
    draft.locacao.trim().length > 0 ||
    draft.status !== undefined ||
    draft.controlsBatch !== undefined ||
    Boolean(dateFilters.dateFrom?.trim()) ||
    Boolean(dateFilters.dateTo?.trim())
  )
}

function countActiveFilters(
  draft: ProductsDraftFilters,
  dateFilters: ProductsDateFilters
): number {
  let count = 0
  if (draft.code.trim()) count++
  if (draft.description.trim()) count++
  if (draft.barCode.trim()) count++
  if (draft.status) count++
  if (draft.controlsBatch !== undefined) count++
  if (draft.manufacturer.trim()) count++
  if (draft.origin.trim()) count++
  if (draft.group.trim()) count++
  if (draft.subgroup.trim()) count++
  if (draft.brand.trim()) count++
  if (draft.application.trim()) count++
  if (draft.locacao.trim()) count++
  if (dateFilters.dateFrom?.trim()) count++
  if (dateFilters.dateTo?.trim()) count++
  return count
}

function buildApiFilters(
  draft: ProductsDraftFilters,
  dateFilters: ProductsDateFilters,
  defaults: ListProductsEnterprisesQuery
) {
  const code = parseCode(draft.code)
  const needsClientFetch =
    draft.controlsBatch !== undefined ||
    Boolean(dateFilters.dateFrom?.trim()) ||
    Boolean(dateFilters.dateTo?.trim()) ||
    Boolean(draft.locacao.trim())

  return {
    filters: {
      ...defaults,
      limit: needsClientFetch
        ? PRODUCTS_CLIENT_SEARCH_LIMIT
        : (defaults.limit ?? 50),
      offset: 0,
      description: draft.description.trim() || undefined,
      status: draft.status,
      code,
      barCode: draft.barCode.trim() || undefined,
      manufacturer: draft.manufacturer.trim() || undefined,
      origin: draft.origin.trim() || undefined,
      group: draft.group.trim() || undefined,
      subgroup: draft.subgroup.trim() || undefined,
      brand: draft.brand.trim() || undefined,
      application: draft.application.trim() || undefined,
    },
    usesClientPagination: needsClientFetch,
  }
}

export function useProductsListFilters(config: ProductsListRouteConfig) {
  const router = useRouter()
  const defaults = useMemo(
    () => config.defaultListFilters() as ListProductsEnterprisesQuery,
    [config]
  )

  const [draftFilters, setDraftFilters] = useState(defaultProductsDraftFilters)
  const [draftDateFilters, setDraftDateFilters] = useState(
    defaultProductsDateFilters
  )
  const [appliedFilters, setAppliedFilters] =
    useState<ListProductsEnterprisesQuery>(defaults)
  const [appliedClientCriteria, setAppliedClientCriteria] =
    useState<ProductsClientFilterCriteria>({
      status: undefined,
      controlsBatch: undefined,
      locacao: undefined,
      dateFilters: defaultProductsDateFilters(),
    })
  const [hasSearched, setHasSearched] = useState(false)
  const [isClientPagination, setIsClientPagination] = useState(false)

  const activeFilterCount = useMemo(
    () => countActiveFilters(draftFilters, draftDateFilters),
    [draftFilters, draftDateFilters]
  )

  const applyFiltersState = useCallback(
    (draft: ProductsDraftFilters, dateFilters: ProductsDateFilters) => {
      const { filters: next, usesClientPagination } = buildApiFilters(
        draft,
        dateFilters,
        defaults
      )
      setDraftFilters(draft)
      setDraftDateFilters(dateFilters)
      setAppliedFilters(next)
      setIsClientPagination(usesClientPagination)
      setAppliedClientCriteria({
        status: draft.status,
        controlsBatch: draft.controlsBatch,
        locacao: draft.locacao.trim() || undefined,
        dateFilters: { ...dateFilters },
      })
      setHasSearched(true)
    },
    [defaults]
  )

  const applySearch = useCallback((): boolean => {
    if (!validateDateRange(draftDateFilters)) return false

    if (!hasAnySearchCriteria(draftFilters, draftDateFilters)) {
      toast.error("Informe ao menos um critério de busca.")
      return false
    }

    applyFiltersState(draftFilters, draftDateFilters)
    return true
  }, [draftFilters, draftDateFilters, applyFiltersState])

  const applyFieldSearch = useCallback(
    (field: ProductsInlineSearchField, value: string): boolean => {
      const trimmed = value.trim()
      if (!trimmed) {
        toast.error("Informe um valor para buscar.")
        return false
      }

      const draft: ProductsDraftFilters = {
        ...defaultProductsDraftFilters(),
        [field]: trimmed,
      }
      const dateFilters = defaultProductsDateFilters()

      applyFiltersState(draft, dateFilters)
      return true
    },
    [applyFiltersState]
  )

  const handleSearchResult = useCallback(
    (items: { id: string }[]) => {
      if (items.length === 1) {
        router.push(`${config.basePath}/${items[0]!.id}`)
      }
    },
    [router, config.basePath]
  )

  const clearFilters = useCallback(() => {
    const reset = config.defaultListFilters() as ListProductsEnterprisesQuery
    setDraftFilters(defaultProductsDraftFilters())
    setDraftDateFilters(defaultProductsDateFilters())
    setAppliedFilters(reset)
    setIsClientPagination(false)
    setAppliedClientCriteria({
      status: undefined,
      controlsBatch: undefined,
      locacao: undefined,
      dateFilters: defaultProductsDateFilters(),
    })
    setHasSearched(false)
  }, [config])

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((filters) => ({ ...filters, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setAppliedFilters((filters) => ({ ...filters, limit, offset: 0 }))
  }, [])

  return {
    draftFilters,
    setDraftFilters,
    draftDateFilters,
    setDraftDateFilters,
    appliedFilters,
    appliedClientCriteria,
    activeFilterCount,
    hasSearched,
    isClientPagination,
    applySearch,
    applyFieldSearch,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  }
}
