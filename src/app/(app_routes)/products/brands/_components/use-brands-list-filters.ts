"use client"

import { useCallback, useState } from "react"

import {
  defaultBrandsDraftFilters,
  defaultBrandsFilters,
  type BrandsDraftFilters,
} from "@/app/(app_routes)/products/brands/_components/brands-constants"
import type { ListProductBrandsQuery } from "@/modules/products/products-catalogs.schema"

function buildApiFilters(
  draft: BrandsDraftFilters,
  defaults: ListProductBrandsQuery
): ListProductBrandsQuery {
  return {
    ...defaults,
    offset: 0,
    description: draft.description.trim() || undefined,
  }
}

export function useBrandsListFilters() {
  const defaults = defaultBrandsFilters()

  const [draftFilters, setDraftFilters] = useState(defaultBrandsDraftFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<ListProductBrandsQuery>(defaults)
  const [hasSearched, setHasSearched] = useState(false)

  const applySearch = useCallback((): boolean => {
    setAppliedFilters(buildApiFilters(draftFilters, defaults))
    setHasSearched(true)
    return true
  }, [draftFilters, defaults])

  const clearFilters = useCallback(() => {
    setDraftFilters(defaultBrandsDraftFilters())
    setAppliedFilters(defaultBrandsFilters())
    setHasSearched(false)
  }, [])

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((filters) => ({ ...filters, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setAppliedFilters((filters) => ({ ...filters, limit, offset: 0 }))
  }, [])

  return {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    hasSearched,
    applySearch,
    clearFilters,
    setPageOffset,
    setLimit,
  }
}
