"use client"

import { useMemo } from "react"
import { useQueries } from "@tanstack/react-query"
import { GEO_CATALOG_STALE_TIME_MS } from "@/modules/addresses/addresses-cache"
import {
  addressCepByIdQueryKey,
  addressCitiesQueryKey,
  addressCountriesQueryKey,
  addressStatesQueryKey,
} from "@/modules/addresses/addresses-query-keys"
import {
  getCepByIdService,
  listCitiesService,
  listCountriesService,
  listStatesService,
} from "@/modules/addresses/addresses.service"

export type GeoAddressRef = {
  countryId: string
  stateId: string
  cityId: string
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
  const uniqueCountryIds = useMemo(
    () => [...new Set(addresses.map((a) => a.countryId))],
    [addresses]
  )
  const uniqueStateIds = useMemo(
    () => [...new Set(addresses.map((a) => a.stateId))],
    [addresses]
  )
  const uniqueCepIds = useMemo(
    () => [...new Set(addresses.map((a) => a.cepId))],
    [addresses]
  )

  const countriesQuery = useQueries({
    queries: [
      {
        queryKey: addressCountriesQueryKey,
        queryFn: () => listCountriesService(),
        enabled: enabled && addresses.length > 0,
        staleTime: GEO_CATALOG_STALE_TIME_MS,
      },
    ],
  })

  const statesQueries = useQueries({
    queries: uniqueCountryIds.map((countryId) => ({
      queryKey: addressStatesQueryKey(countryId),
      queryFn: () => listStatesService(countryId),
      enabled: enabled && addresses.length > 0,
      staleTime: GEO_CATALOG_STALE_TIME_MS,
    })),
  })

  const citiesQueries = useQueries({
    queries: uniqueStateIds.map((stateId) => ({
      queryKey: addressCitiesQueryKey(stateId),
      queryFn: () => listCitiesService(stateId),
      enabled: enabled && addresses.length > 0,
      staleTime: GEO_CATALOG_STALE_TIME_MS,
    })),
  })

  const cepsQueries = useQueries({
    queries: uniqueCepIds.map((cepId) => ({
      queryKey: addressCepByIdQueryKey(cepId),
      queryFn: () => getCepByIdService(cepId),
      enabled: enabled && addresses.length > 0,
      staleTime: GEO_CATALOG_STALE_TIME_MS,
    })),
  })

  const isLoading =
    countriesQuery.some((q) => q.isPending) ||
    statesQueries.some((q) => q.isPending) ||
    citiesQueries.some((q) => q.isPending) ||
    cepsQueries.some((q) => q.isPending)

  const getDisplay = useMemo(() => {
    const countries = countriesQuery[0]?.data ?? []
    const countryMap = new Map(countries.map((c) => [c.id, c.countryName]))

    const stateMap = new Map<string, { description: string; acronym: string }>()
    for (const q of statesQueries) {
      for (const s of q.data ?? []) {
        stateMap.set(s.id, { description: s.description, acronym: s.acronym })
      }
    }

    const cityMap = new Map<string, string>()
    for (const q of citiesQueries) {
      for (const c of q.data ?? []) {
        cityMap.set(c.id, c.citieName)
      }
    }

    const cepMap = new Map<
      string,
      {
        cepNumber: string
        address: string
        neighborhood: string
        number: string
        complement: string | null
      }
    >()
    for (const q of cepsQueries) {
      const c = q.data
      if (!c) continue
      cepMap.set(c.id, {
        cepNumber: c.cepNumber,
        address: c.address,
        neighborhood: c.neighborhood,
        number: c.number,
        complement: c.complement,
      })
    }

    return (address: T): AddressDisplay => {
      const countryName = countryMap.get(address.countryId) ?? address.countryId
      const state = stateMap.get(address.stateId)
      const stateLabel = state
        ? `${state.acronym} — ${state.description}`
        : address.stateId
      const cityName = cityMap.get(address.cityId) ?? address.cityId
      const cep = cepMap.get(address.cepId)
      const cepFormatted = cep ? formatCepNumber(cep.cepNumber) : ""
      const cepLabel = cep
        ? `${cepFormatted} — ${cep.address}, ${cep.neighborhood}`
        : address.cepId
      const cepSummary = cep
        ? `${cepFormatted} · ${cep.address}${cep.number ? `, ${cep.number}` : ""} · ${cep.neighborhood}`
        : address.cepId

      return { countryName, stateLabel, cityName, cepLabel, cepSummary }
    }
  }, [countriesQuery, statesQueries, citiesQueries, cepsQueries])

  return { getDisplay, isLoading }
}
