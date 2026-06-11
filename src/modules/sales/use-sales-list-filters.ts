"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  defaultSalesDateFilters,
  hasActiveSalesDateFilters,
  type SalesDateFilters,
} from "@/modules/sales/sales-constants"
import type { SalesListRouteConfig } from "@/modules/sales/sales-route-config"
import {
  parseSalesSearchTerm,
  type ParsedSalesSearch,
} from "@/modules/sales/sales-rules"
import type { ListSalesQuery } from "@/modules/sales/sales.schema"

export const SALES_CLIENT_SEARCH_LIMIT = 100

function validateDateRange(dateFilters: SalesDateFilters): boolean {
  const dateFrom = dateFilters.dateFrom?.trim()
  const dateTo = dateFilters.dateTo?.trim()
  if (dateFrom && dateTo && dateFrom > dateTo) {
    toast.error("A data inicial não pode ser posterior à data final.")
    return false
  }
  return true
}

function buildSearchFilters(
  parsed: ParsedSalesSearch,
  draftFilters: ListSalesQuery,
  defaults: ListSalesQuery,
  dateFilters: SalesDateFilters
): ListSalesQuery | null {
  const dateActive = hasActiveSalesDateFilters(dateFilters)
  const needsClientFetch = dateActive || parsed.kind === "name"

  const base: ListSalesQuery = {
    ...defaults,
    status: draftFilters.status,
    budgetClosureSituation: draftFilters.budgetClosureSituation,
    limit: needsClientFetch
      ? SALES_CLIENT_SEARCH_LIMIT
      : (draftFilters.limit ?? defaults.limit),
    offset: 0,
    orderNumber: undefined,
    seller: undefined,
    client: undefined,
  }

  switch (parsed.kind) {
    case "empty":
      return base
    case "orderNumber":
      return { ...base, orderNumber: parsed.orderNumber }
    case "name":
      if (parsed.name.length < 2) {
        toast.error(
          "Informe ao menos 2 caracteres para buscar por vendedor ou cliente."
        )
        return null
      }
      return base
  }
}

export function useSalesListFilters(config: SalesListRouteConfig) {
  const router = useRouter()
  const defaults = useMemo(() => config.defaultListFilters(), [config])

  const [searchTerm, setSearchTerm] = useState("")
  const [nameSearchFilter, setNameSearchFilter] = useState<string | undefined>()
  const [draftFilters, setDraftFilters] = useState<ListSalesQuery>(defaults)
  const [appliedFilters, setAppliedFilters] = useState<ListSalesQuery>(defaults)
  const [draftDateFilters, setDraftDateFilters] = useState(defaultSalesDateFilters)
  const [appliedDateFilters, setAppliedDateFilters] = useState(defaultSalesDateFilters)

  const isClientDatePagination = hasActiveSalesDateFilters(appliedDateFilters)
  const isClientNamePagination = Boolean(nameSearchFilter)
  const isClientPagination = isClientDatePagination || isClientNamePagination

  const applySearch = useCallback((): boolean => {
    if (!validateDateRange(draftDateFilters)) return false

    const parsed = parseSalesSearchTerm(searchTerm)
    const next = buildSearchFilters(
      parsed,
      draftFilters,
      defaults,
      draftDateFilters
    )
    if (!next) return false

    setNameSearchFilter(parsed.kind === "name" ? parsed.name : undefined)
    setDraftFilters(next)
    setAppliedFilters(next)
    setAppliedDateFilters({ ...draftDateFilters })
    return true
  }, [searchTerm, draftFilters, draftDateFilters, defaults])

  const applyFilters = useCallback((): boolean => {
    if (!validateDateRange(draftDateFilters)) return false

    const parsed = parseSalesSearchTerm(searchTerm)
    const next = buildSearchFilters(
      parsed,
      draftFilters,
      defaults,
      draftDateFilters
    )
    if (!next) return false

    setNameSearchFilter(parsed.kind === "name" ? parsed.name : undefined)
    setAppliedFilters(next)
    setAppliedDateFilters({ ...draftDateFilters })
    return true
  }, [searchTerm, draftFilters, draftDateFilters, defaults])

  const handleSearchResult = useCallback(
    (items: { id: string }[]) => {
      if (items.length === 1) {
        router.push(`${config.basePath}/${items[0].id}`)
      }
    },
    [config.basePath, router]
  )

  const clearFilters = useCallback(() => {
    const reset = config.defaultListFilters()
    const resetDate = defaultSalesDateFilters()
    setSearchTerm("")
    setNameSearchFilter(undefined)
    setDraftFilters(reset)
    setAppliedFilters(reset)
    setDraftDateFilters(resetDate)
    setAppliedDateFilters(resetDate)
  }, [config])

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((filters) => ({ ...filters, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setDraftFilters((f) => ({ ...f, limit }))
    setAppliedFilters((f) => ({ ...f, limit, offset: 0 }))
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    nameSearchFilter,
    draftFilters,
    setDraftFilters,
    appliedFilters,
    draftDateFilters,
    setDraftDateFilters,
    appliedDateFilters,
    isClientPagination,
    isClientDatePagination,
    isClientNamePagination,
    applySearch,
    applyFilters,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  }
}
