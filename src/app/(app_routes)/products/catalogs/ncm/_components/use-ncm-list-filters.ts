"use client"

import { useCallback, useState } from "react"

import {
  defaultNcmDraftFilters,
  defaultNcmFilters,
  type NcmDraftFilters,
} from "@/app/(app_routes)/products/catalogs/ncm/_components/ncm-constants"
import type { ListProductsNcmQuery } from "@/modules/products/products-catalogs.schema"

function buildApiFilters(
  draft: NcmDraftFilters,
  defaults: ListProductsNcmQuery
): ListProductsNcmQuery {
  return {
    ...defaults,
    offset: 0,
    ncm: draft.ncm.trim() || undefined,
    description: draft.description.trim() || undefined,
  }
}

export function useNcmListFilters() {
  const defaults = defaultNcmFilters()

  const [draftFilters, setDraftFilters] = useState(defaultNcmDraftFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<ListProductsNcmQuery>(defaults)
  const [hasSearched, setHasSearched] = useState(false)

  const applySearch = useCallback((): boolean => {
    setAppliedFilters(buildApiFilters(draftFilters, defaults))
    setHasSearched(true)
    return true
  }, [draftFilters, defaults])

  const clearFilters = useCallback(() => {
    setDraftFilters(defaultNcmDraftFilters())
    setAppliedFilters(defaultNcmFilters())
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
