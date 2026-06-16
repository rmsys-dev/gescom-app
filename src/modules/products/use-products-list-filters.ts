"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import type { ListProductsEnterprisesQuery } from "@/modules/products/products.schema"

export function useProductsListFilters(config: ProductsListRouteConfig) {
  const router = useRouter()
  const defaults = useMemo(
    () => config.defaultListFilters() as ListProductsEnterprisesQuery,
    [config]
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [draftFilters, setDraftFilters] =
    useState<ListProductsEnterprisesQuery>(defaults)
  const [appliedFilters, setAppliedFilters] =
    useState<ListProductsEnterprisesQuery>(defaults)

  const applySearch = useCallback(() => {
    const search = searchTerm.trim()
    if (search.length > 0 && search.length < 1) {
      toast.error("A pesquisa deve ter pelo menos 1 caractere.")
      return false
    }
    setAppliedFilters({
      ...draftFilters,
      offset: 0,
      search: search.length > 0 ? search : undefined,
    })
    return true
  }, [searchTerm, draftFilters])

  const applyFilters = useCallback(() => {
    const search = searchTerm.trim()
    setAppliedFilters({
      ...draftFilters,
      offset: 0,
      search: search.length > 0 ? search : undefined,
    })
    return true
  }, [searchTerm, draftFilters])

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
    setSearchTerm("")
    setDraftFilters(reset)
    setAppliedFilters(reset)
  }, [config])

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((f) => ({ ...f, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setDraftFilters((f) => ({ ...f, limit }))
    setAppliedFilters((f) => ({ ...f, limit, offset: 0 }))
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applySearch,
    applyFilters,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  }
}
