"use client"

import { useQuery } from "@tanstack/react-query"
import {
  GEO_CATALOG_STALE_TIME_MS,
  GEO_CEP_SEARCH_STALE_TIME_MS,
} from "@/modules/addresses/addresses-cache"
import {
  addressCepsQueryKey,
  addressCitiesQueryKey,
  addressCountriesQueryKey,
  addressStatesQueryKey,
} from "@/modules/addresses/addresses-query-keys"
import {
  listCepsService,
  listCitiesService,
  listCountriesService,
  listStatesService,
} from "@/modules/addresses/addresses.service"

export {
  addressCepsQueryKey,
  addressCitiesQueryKey,
  addressCountriesQueryKey,
  addressStatesQueryKey,
} from "@/modules/addresses/addresses-query-keys"

export function useCountriesQuery(enabled = true) {
  return useQuery({
    queryKey: addressCountriesQueryKey,
    queryFn: () => listCountriesService(),
    enabled,
    staleTime: GEO_CATALOG_STALE_TIME_MS,
  })
}

export function useStatesQuery(countryId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: addressStatesQueryKey(countryId ?? ""),
    queryFn: () => listStatesService(countryId!),
    enabled: enabled && Boolean(countryId),
    staleTime: GEO_CATALOG_STALE_TIME_MS,
  })
}

export function useCitiesQuery(stateId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: addressCitiesQueryKey(stateId ?? ""),
    queryFn: () => listCitiesService(stateId!),
    enabled: enabled && Boolean(stateId),
    staleTime: GEO_CATALOG_STALE_TIME_MS,
  })
}

export function useCepsQuery(
  cityId: string | undefined,
  cepNumber?: string,
  enabled = true
) {
  const digits = cepNumber?.replace(/\D/g, "") ?? ""
  return useQuery({
    queryKey: addressCepsQueryKey(cityId ?? "", digits || undefined),
    queryFn: () => listCepsService(cityId!, digits || undefined),
    enabled:
      enabled && Boolean(cityId) && (!digits || digits.length === 8),
    staleTime: digits ? GEO_CEP_SEARCH_STALE_TIME_MS : GEO_CATALOG_STALE_TIME_MS,
  })
}
