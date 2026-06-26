"use client"

import { useCallback, useState } from "react"

import { DEFAULT_CATALOG_FILTERS } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import type { PaginationQuery } from "@/modules/products/products-query"

export function useCatalogListFilters() {
  const [appliedFilters, setAppliedFilters] =
    useState<PaginationQuery>(DEFAULT_CATALOG_FILTERS)

  const clearFilters = useCallback(() => {
    setAppliedFilters(DEFAULT_CATALOG_FILTERS)
  }, [])

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((filters) => ({ ...filters, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setAppliedFilters((filters) => ({ ...filters, limit, offset: 0 }))
  }, [])

  return {
    appliedFilters,
    clearFilters,
    setPageOffset,
    setLimit,
  }
}
