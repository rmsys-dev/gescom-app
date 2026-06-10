"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"

export function useMembersListFilters(config: MembershipRouteConfig) {
  const [draftFilters, setDraftFilters] = useState<ListMembersQuery>(
    config.defaultListFilters()
  )
  const [appliedFilters, setAppliedFilters] = useState<ListMembersQuery>(
    config.defaultListFilters()
  )

  const applyFiltersFromForm = useCallback(() => {
    const form = document.getElementById(config.list.filtersFormId)
    if (!form || !(form instanceof HTMLFormElement)) {
      setAppliedFilters({ ...draftFilters, offset: 0 })
      return
    }
    const emailEl = form.elements.namedItem("email") as HTMLInputElement | null
    const regEl = form.elements.namedItem(
      "registration"
    ) as HTMLInputElement | null
    const phoneEl = form.elements.namedItem("phone") as HTMLInputElement | null

    let registration: string | undefined
    if (regEl?.value.trim()) {
      const regParsed = cpfCnpjSchema.safeParse(
        normalizeRegistration(regEl.value)
      )
      if (!regParsed.success) {
        toast.error("CPF/CNPJ inválido para filtro.")
        return
      }
      registration = regParsed.data
    }

    let phone: string | undefined
    if (phoneEl?.value.trim()) {
      const phoneParsed = phoneE164Schema.safeParse(
        normalizePhone(phoneEl.value)
      )
      if (!phoneParsed.success) {
        toast.error("Telefone inválido. Use formato +5511999999999.")
        return
      }
      phone = phoneParsed.data
    }

    setAppliedFilters({
      ...draftFilters,
      offset: 0,
      email: emailEl?.value ? normalizeEmail(emailEl.value) : undefined,
      registration,
      phone,
    })
  }, [config.list.filtersFormId, draftFilters])

  const clearFilters = useCallback(() => {
    const reset = config.defaultListFilters()
    setDraftFilters(reset)
    setAppliedFilters(reset)
  }, [config])

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((filters) => ({ ...filters, offset }))
  }, [])

  return {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applyFiltersFromForm,
    clearFilters,
    setPageOffset,
  }
}
