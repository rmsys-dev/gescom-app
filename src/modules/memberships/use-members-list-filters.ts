"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import {
  defaultMembersDraftFilters,
  MEMBERS_NAME_SEARCH_LIMIT,
  type MembersDraftFilters,
} from "@/app/(app_routes)/members/_components/members-constants"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"

const emailSchema = z.string().trim().email()

function parseCode(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  if (!Number.isInteger(parsed) || parsed <= 0) return undefined
  return parsed
}

function hasAnySearchCriteria(draft: MembersDraftFilters): boolean {
  return (
    draft.code.trim().length > 0 ||
    draft.name.trim().length > 0 ||
    draft.registration.trim().length > 0 ||
    draft.email.trim().length > 0 ||
    draft.phone.trim().length > 0
  )
}

function buildApiFilters(
  draft: MembersDraftFilters,
  defaults: ListMembersQuery
): {
  filters: ListMembersQuery
  nameFilter?: string
  usesLocalPagination: boolean
} | null {
  const codeRaw = draft.code.trim()
  const name = draft.name.trim()
  const registrationRaw = draft.registration.trim()
  const emailRaw = draft.email.trim()
  const phoneRaw = draft.phone.trim()

  const usesLocalPagination = name.length >= 2

  const filters: ListMembersQuery = {
    ...defaults,
    offset: 0,
    code: undefined,
    registration: undefined,
    email: undefined,
    phone: undefined,
    limit: usesLocalPagination
      ? MEMBERS_NAME_SEARCH_LIMIT
      : (defaults.limit ?? 50),
  }

  if (name.length > 0) {
    if (name.length < 2) {
      toast.error("Informe ao menos 2 caracteres para buscar por nome.")
      return null
    }
  }

  if (codeRaw) {
    const parsed = parseCode(codeRaw)
    if (parsed === undefined) {
      toast.error("Código inválido.")
      return null
    }
    filters.code = parsed
  }

  if (registrationRaw) {
    const valid = cpfCnpjSchema.safeParse(normalizeRegistration(registrationRaw))
    if (!valid.success) {
      toast.error("CPF/CNPJ inválido.")
      return null
    }
    filters.registration = valid.data
  }

  if (emailRaw) {
    const valid = emailSchema.safeParse(normalizeEmail(emailRaw))
    if (!valid.success) {
      toast.error("E-mail inválido.")
      return null
    }
    filters.email = valid.data
  }

  if (phoneRaw) {
    const valid = phoneE164Schema.safeParse(normalizePhone(phoneRaw))
    if (!valid.success) {
      toast.error("Telefone inválido. Use o formato (DD) 9XXXX-XXXX.")
      return null
    }
    filters.phone = valid.data
  }

  return {
    filters,
    nameFilter: usesLocalPagination ? name : undefined,
    usesLocalPagination,
  }
}

export type UseMembersListFiltersOptions = {
  defaultListFilters: ListMembersQuery
  singleResultPath?: string
}

export function useMembersListFilters({
  defaultListFilters,
  singleResultPath = "/members",
}: UseMembersListFiltersOptions) {
  const router = useRouter()
  const defaults = useMemo(() => defaultListFilters, [defaultListFilters])

  const [draftFilters, setDraftFilters] = useState(defaultMembersDraftFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<ListMembersQuery>(defaults)
  const [nameFilter, setNameFilter] = useState<string | undefined>()
  const [hasSearched, setHasSearched] = useState(false)
  const [isLocalPagination, setIsLocalPagination] = useState(false)

  const applyFiltersState = useCallback(
    (draft: MembersDraftFilters) => {
      const built = buildApiFilters(draft, defaults)
      if (!built) return false

      setDraftFilters(draft)
      setAppliedFilters(built.filters)
      setNameFilter(built.nameFilter)
      setIsLocalPagination(built.usesLocalPagination)
      setHasSearched(true)
      return true
    },
    [defaults]
  )

  const applySearch = useCallback((): boolean => {
    if (!hasAnySearchCriteria(draftFilters)) {
      toast.error("Informe ao menos um critério de busca.")
      return false
    }

    return applyFiltersState(draftFilters)
  }, [draftFilters, applyFiltersState])

  const handleSearchResult = useCallback(
    (items: { id: string }[]) => {
      if (items.length === 1) {
        router.push(`${singleResultPath}/${items[0].id}`)
      }
    },
    [router, singleResultPath]
  )

  const clearFilters = useCallback(() => {
    const reset = defaultListFilters
    setDraftFilters(defaultMembersDraftFilters())
    setAppliedFilters(reset)
    setNameFilter(undefined)
    setIsLocalPagination(false)
    setHasSearched(false)
  }, [defaultListFilters])

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
    nameFilter,
    hasSearched,
    isLocalPagination,
    applySearch,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  }
}
