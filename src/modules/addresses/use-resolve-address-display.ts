"use client"

import { useMemo } from "react"
import { useQueries } from "@tanstack/react-query"
import { GEO_CATALOG_STALE_TIME_MS } from "@/modules/addresses/addresses-cache"
import {
  addressCepByIdQueryKey,
} from "@/modules/addresses/addresses-query-keys"
import {
  getCepByIdService,
} from "@/modules/addresses/addresses.service"

/**
 * Referência mínima a um endereço — apenas cepId é obrigatório.
 * countryId/stateId/cityId foram removidos das tabelas na migração 0015;
 * a hierarquia geo é resolvida a partir do cepId.
 */
export type GeoAddressRef = {
  cepId: string
}

export type AddressDisplay = {
  countryName: string
  stateLabel: string
  cityName: string
  cepLabel: string
  cepSummary: string
}

function formatCepNumber(cepNumber: string): string {
  const digits = cepNumber.replace(/\D/g, "")
  if (digits.length !== 8) return cepNumber
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function useResolveAddressDisplay<T extends GeoAddressRef>(
  addresses: T[],
  enabled = true
) {
  const uniqueCepIds = useMemo(
    () => [...new Set(addresses.map((a) => a.cepId))],
    [addresses]
  )

  const cepsQueries = useQueries({
    queries: uniqueCepIds.map((cepId) => ({
      queryKey: addressCepByIdQueryKey(cepId),
      queryFn: () => getCepByIdService(cepId),
      enabled: enabled && addresses.length > 0,
      staleTime: GEO_CATALOG_STALE_TIME_MS,
    })),
  })

  const isLoading = cepsQueries.some((q) => q.isPending)

  const getDisplay = useMemo(() => {
    const cepMap = new Map<
      string,
      {
        cepNumber: string
        address: string
        neighborhood: string
      }
    >()
    for (const q of cepsQueries) {
      const c = q.data
      if (!c) continue
      cepMap.set(c.id, {
        cepNumber: c.cepNumber,
        address: c.address,
        neighborhood: c.neighborhood,
      })
    }

    return (address: T): AddressDisplay => {
      const cep = cepMap.get(address.cepId)
      const cepFormatted = cep ? formatCepNumber(cep.cepNumber) : ""
      const cepLabel = cep
        ? `${cepFormatted} — ${cep.address}, ${cep.neighborhood}`
        : address.cepId
      const cepSummary = cep
        ? `${cepFormatted} · ${cep.address} · ${cep.neighborhood}`
        : address.cepId

      return {
        countryName: "",
        stateLabel: "",
        cityName: "",
        cepLabel,
        cepSummary,
      }
    }
  }, [cepsQueries])

  return { getDisplay, isLoading }
}
