"use client"

import { useCallback, useState } from "react"

import {
  defaultNbsDraftFilters,
  defaultNbsFilters,
  type NbsDraftFilters,
} from "@/app/(app_routes)/products/catalogs/nbs/_components/nbs-constants"
import type { ListProductNbsQuery } from "@/modules/products/products-catalogs.schema"

function buildApiFilters(
  draft: NbsDraftFilters,
  defaults: ListProductNbsQuery
): ListProductNbsQuery {
  return {
    ...defaults,
    offset: 0,
    nbs: draft.nbs.trim() || undefined,
    description: draft.description.trim() || undefined,
  }
}

export function useNbsListFilters() {
  const defaults = defaultNbsFilters()

  const [draftFilters, setDraftFilters] = useState(defaultNbsDraftFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<ListProductNbsQuery>(defaults)
  const [hasSearched, setHasSearched] = useState(false)

  const applySearch = useCallback((): boolean => {
    setAppliedFilters(buildApiFilters(draftFilters, defaults))
    setHasSearched(true)
    return true
  }, [draftFilters, defaults])

  const clearFilters = useCallback(() => {
    setDraftFilters(defaultNbsDraftFilters())
    setAppliedFilters(defaultNbsFilters())
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
