"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/components/providers/authentication/auth-store"
import { HttpError } from "@/lib/api/http-error"
import { fetchAuthMe, meUserToAuthUser } from "@/modules/authentication/auth.service"
import type { MeResponse } from "@/modules/authentication/auth.schema"

const ME_STALE_TIME_MS = 5 * 60_000

function useMeQueryEnabled() {
  const { hydrated, isAuthenticated } = useAuth()
  return {
    enabled: hydrated && isAuthenticated,
  }
}

/** Resposta completa de `GET /auth/me` (utilizador, empresa do token, permissões). */
export function useMeQuery() {
  const { enabled } = useMeQueryEnabled()
  const { signOut } = useAuth()
  return useQuery({
    queryKey: ["account", "me"],
    queryFn: async (): Promise<MeResponse> => {
      try {
        return await fetchAuthMe()
      } catch (error) {
        if (error instanceof HttpError && error.status === 401) {
          signOut()
        }
        throw error
      }
    },
    enabled,
    staleTime: ME_STALE_TIME_MS,
  })
}

/** Resposta simplificada de `GET /auth/me` (utilizador). */
export function useAccountProfileQuery() {
  const { enabled } = useMeQueryEnabled()
  return useQuery({
    queryKey: ["account", "me"],
    queryFn: async () => fetchAuthMe(),
    enabled,
    staleTime: ME_STALE_TIME_MS,
    select: (me) => meUserToAuthUser(me.user),
  })
}
