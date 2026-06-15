"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuthSession } from "@/lib/auth/use-auth-session"
import { HttpError } from "@/lib/api/http-error"
import { fetchAuthMe, meUserToAuthUser } from "@/modules/authentication/auth.service"
import type { MeResponse } from "@/modules/authentication/auth.schema"

import { CACHE } from "@/lib/react-query/cache-policy"

function useMeQueryEnabled() {
  const { hydrated, isAuthenticated } = useAuthSession()
  return {
    enabled: hydrated && isAuthenticated,
  }
}

/** Resposta completa de `GET /auth/me` (utilizador, empresa do token, permissões). */
export function useMeQuery() {
  const { enabled } = useMeQueryEnabled()
  const { signOut } = useAuthSession()
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
    staleTime: CACHE.account,
  })
}

/** Resposta simplificada de `GET /auth/me` (utilizador). */
export function useAccountProfileQuery() {
  const { enabled } = useMeQueryEnabled()
  return useQuery({
    queryKey: ["account", "me"],
    queryFn: async () => fetchAuthMe(),
    enabled,
    staleTime: CACHE.account,
    select: (me) => meUserToAuthUser(me.user),
  })
}
