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

function buildApiSearchTerm(draft: ProductsDraftFilters): string | undefined {
  const description = draft.description.trim()
  if (description.length > 0) return description

  const barCode = draft.barCode.trim()
  if (barCode.length > 0) return barCode

  const manufacturer = draft.manufacturer.trim()
  if (manufacturer.length > 0) return manufacturer

  const code = draft.code.trim()
  if (code.length > 0) return code

  return undefined
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
  if (dateFilters.dateFrom?.trim()) count++
  if (dateFilters.dateTo?.trim()) count++
  return count
}

function buildApiFilters(
  draft: ProductsDraftFilters,
  dateFilters: ProductsDateFilters,
  defaults: ListProductsEnterprisesQuery
) {
  const search = buildApiSearchTerm(draft)
  const code = parseCode(draft.code)
  const barCode = draft.barCode.trim() || undefined
  const manufacturer = draft.manufacturer.trim() || undefined
  const dateFrom = dateFilters.dateFrom?.trim() || undefined
  const dateTo = dateFilters.dateTo?.trim() || undefined
  const needsClientFetch =
    draft.controlsBatch !== undefined ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    Boolean(barCode) ||
    Boolean(manufacturer) ||
    Boolean(draft.description.trim()) ||
    Boolean(draft.code.trim())

  return {
    filters: {
      ...defaults,
      limit: needsClientFetch
        ? PRODUCTS_CLIENT_SEARCH_LIMIT
        : (defaults.limit ?? 50),
      offset: 0,
      search,
      status: draft.status,
      code,
      barCode,
      manufacturer,
      controlsBatch: draft.controlsBatch,
      dateFrom,
      dateTo,
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
      ...defaultProductsDraftFilters(),
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
        code: draft.code,
        description: draft.description,
        barCode: draft.barCode,
        status: draft.status,
        controlsBatch: draft.controlsBatch,
        manufacturer: draft.manufacturer,
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
      ...defaultProductsDraftFilters(),
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
