"use client"

import { useEffect, useRef, type RefObject } from "react"

export function useExplicitSearchRedirect({
  isExplicitSearch,
  isFetching,
  isPending,
  data,
  filteredItems,
  isLocalPagination,
  handleSearchResult,
}: {
  isExplicitSearch: RefObject<boolean>
  isFetching: boolean
  isPending: boolean
  data: { items: { id: string }[] } | undefined
  filteredItems: { id: string }[]
  isLocalPagination: boolean
  handleSearchResult: (items: { id: string }[]) => void
}) {
  useEffect(() => {
    if (!isExplicitSearch.current) return
    if (isFetching || isPending) return
    if (!data) return
    isExplicitSearch.current = false
    handleSearchResult(isLocalPagination ? filteredItems : data.items)
  }, [
    isFetching,
    isPending,
    data,
    filteredItems,
    isLocalPagination,
    handleSearchResult,
    isExplicitSearch,
  ])
}

export function useExplicitSearchRef() {
  return useRef(false)
}
