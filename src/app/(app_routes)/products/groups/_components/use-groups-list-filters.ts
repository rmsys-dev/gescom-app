"use client"

import { useCallback, useState } from "react"

import {
  defaultGroupsDraftFilters,
  defaultGroupsFilters,
  type GroupsDraftFilters,
} from "@/app/(app_routes)/products/groups/_components/groups-constants"
import type { ListProductGroupsQuery } from "@/modules/products/products-catalogs.schema"

function buildApiFilters(
  draft: GroupsDraftFilters,
  defaults: ListProductGroupsQuery
): ListProductGroupsQuery {
  return {
    ...defaults,
    offset: 0,
    description: draft.description.trim() || undefined,
  }
}

export function useGroupsListFilters() {
  const defaults = defaultGroupsFilters()

  const [draftFilters, setDraftFilters] = useState(defaultGroupsDraftFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<ListProductGroupsQuery>(defaults)
  const [hasSearched, setHasSearched] = useState(false)

  const applySearch = useCallback((): boolean => {
    setAppliedFilters(buildApiFilters(draftFilters, defaults))
    setHasSearched(true)
    return true
  }, [draftFilters, defaults])

  const clearFilters = useCallback(() => {
    setDraftFilters(defaultGroupsDraftFilters())
    setAppliedFilters(defaultGroupsFilters())
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
