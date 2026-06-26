"use client"

import { useCallback, useState } from "react"

import {
  defaultSubgroupsDraftFilters,
  defaultSubgroupsFilters,
  type SubgroupsDraftFilters,
} from "@/app/(app_routes)/products/subgroups/_components/subgroups-constants"
import type { ListProductSubgroupsQuery } from "@/modules/products/products-catalogs.schema"

function buildApiFilters(
  draft: SubgroupsDraftFilters,
  defaults: ListProductSubgroupsQuery
): ListProductSubgroupsQuery {
  return {
    ...defaults,
    offset: 0,
    description: draft.description.trim() || undefined,
  }
}

export function useSubgroupsListFilters() {
  const defaults = defaultSubgroupsFilters()

  const [draftFilters, setDraftFilters] = useState(defaultSubgroupsDraftFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<ListProductSubgroupsQuery>(defaults)
  const [hasSearched, setHasSearched] = useState(false)

  const applySearch = useCallback((): boolean => {
    setAppliedFilters(buildApiFilters(draftFilters, defaults))
    setHasSearched(true)
    return true
  }, [draftFilters, defaults])

  const clearFilters = useCallback(() => {
    setDraftFilters(defaultSubgroupsDraftFilters())
    setAppliedFilters(defaultSubgroupsFilters())
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
