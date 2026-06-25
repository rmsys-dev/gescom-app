"use client"

import { useMemo, type Dispatch, type SetStateAction } from "react"

import type { MembersDraftFilters } from "@/app/(app_routes)/members/_components/members-constants"
import type { SearchFormField } from "@/components/global/forms/search-form"
import { filterMembersByName } from "@/modules/memberships/memberships-rules"
import type { ListMembersQuery, MemberListItem } from "@/modules/memberships/memberships.schema"
import { useMembersQuery } from "@/modules/memberships/use-members"

type FilterFieldDef<K extends string> = {
  id: string
  key: K
  label: string
  placeholder: string
  inputMode?: "text" | "numeric"
  numericOnly?: boolean
}

export function buildSearchFieldsFromDraft<
  T extends Record<string, string>,
  K extends keyof T & string,
>(
  draftFilters: T,
  filterFields: FilterFieldDef<K>[],
  setDraftFilters: Dispatch<SetStateAction<T>>
): SearchFormField[] {
  return filterFields.map(
    ({ id, key, label, placeholder, inputMode, numericOnly }) => ({
      id,
      label,
      value: draftFilters[key],
      onChange: (value: string) => {
        const nextValue = numericOnly ? value.replace(/\D/g, "") : value
        setDraftFilters((prev) => ({ ...prev, [key]: nextValue }))
      },
      placeholder,
      ariaLabel: label,
      inputMode,
    })
  )
}

export type MembershipListingResult = {
  items: MemberListItem[]
  total: number
  limit: number
  offset: number
  rangeStart: number
  rangeEnd: number
}

export function computeMembershipListing({
  data,
  appliedFilters,
  filteredItems,
  isLocalPagination,
}: {
  data: { items: MemberListItem[]; total?: number; limit?: number; offset?: number } | undefined
  appliedFilters: ListMembersQuery
  filteredItems: MemberListItem[]
  isLocalPagination: boolean
}): MembershipListingResult {
  const limit = appliedFilters.limit ?? data?.limit ?? 50
  const offset = isLocalPagination
    ? (appliedFilters.offset ?? 0)
    : (data?.offset ?? 0)
  const total = isLocalPagination ? filteredItems.length : (data?.total ?? 0)
  const items = isLocalPagination
    ? filteredItems.slice(offset, offset + limit)
    : filteredItems

  return {
    items,
    total,
    limit,
    offset,
    rangeStart: total === 0 ? 0 : offset + 1,
    rangeEnd: Math.min(offset + limit, total),
  }
}

export function useMembershipListingData({
  enterpriseId,
  appliedFilters,
  nameFilter,
  isLocalPagination,
  hasSearched,
  enabled,
}: {
  enterpriseId: string | undefined
  appliedFilters: ListMembersQuery
  nameFilter: string | undefined
  isLocalPagination: boolean
  hasSearched: boolean
  enabled: boolean
}) {
  const { data, error, isPending, isFetching, refetch } = useMembersQuery({
    enterpriseId,
    filters: appliedFilters,
    enabled: enabled && hasSearched,
  })

  const filteredItems = useMemo(() => {
    if (!data) return []
    if (!nameFilter) return data.items
    return filterMembersByName(data.items, nameFilter)
  }, [data, nameFilter])

  const listing = useMemo(
    () =>
      computeMembershipListing({
        data,
        appliedFilters,
        filteredItems,
        isLocalPagination,
      }),
    [appliedFilters, data, filteredItems, isLocalPagination]
  )

  return {
    data,
    error,
    isPending,
    isFetching,
    refetch,
    filteredItems,
    listing,
  }
}

export function useMembershipSearchFields(
  draftFilters: MembersDraftFilters,
  filterFields: FilterFieldDef<keyof MembersDraftFilters & string>[],
  setDraftFilters: React.Dispatch<React.SetStateAction<MembersDraftFilters>>
) {
  return useMemo(
    () => buildSearchFieldsFromDraft(draftFilters, filterFields, setDraftFilters),
    [draftFilters, filterFields, setDraftFilters]
  )
}
