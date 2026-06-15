"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { CACHE } from "@/lib/react-query/cache-policy"
import { useMutationWithToast } from "@/lib/react-query/use-mutation-with-toast"
import type {
  CreateUserRequest,
  ListUsersQuery,
  UpdateUserRequest,
} from "@/modules/users/users.schema"
import {
  userQueryKey,
  usersQueryKey,
} from "@/modules/users/users-query-keys"
import {
  createUserService,
  getUserService,
  listAllUsersService,
  listUsersService,
  updateUserService,
} from "@/modules/users/users.service"

export { userQueryKey, usersQueryKey } from "@/modules/users/users-query-keys"
export { userDetailsQueryKey } from "@/modules/users/users-query-keys"

export function useUsersQuery({
  enterpriseId,
  filters = {},
  enabled = true,
  fetchAllPages = false,
}: {
  enterpriseId: string | undefined
  filters?: ListUsersQuery
  enabled?: boolean
  /** Quando true, percorre todas as páginas da API (ex.: busca por nome). */
  fetchAllPages?: boolean
}) {
  return useQuery({
    queryKey: fetchAllPages
      ? ([...usersQueryKey(enterpriseId ?? "", filters), "all-pages"] as const)
      : usersQueryKey(enterpriseId ?? "", filters),
    queryFn: async ({ signal }) => {
      if (fetchAllPages) {
        const { items, truncated } = await listAllUsersService(
          enterpriseId!,
          filters,
          { signal }
        )
        return {
          items,
          total: items.length,
          limit: items.length,
          offset: 0,
          truncated,
        }
      }
      return listUsersService(enterpriseId!, filters)
    },
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantList,
  })
}

export function useUserQuery({
  enterpriseId,
  userId,
  enabled = true,
  retry = true,
}: {
  enterpriseId: string | undefined
  userId: string | undefined
  enabled?: boolean
  retry?: boolean | number
}) {
  return useQuery({
    queryKey: userQueryKey(enterpriseId ?? "", userId ?? ""),
    queryFn: () => getUserService(enterpriseId!, userId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(userId),
    staleTime: CACHE.tenantDetail,
    retry,
  })
}

export function useCreateUserMutation(enterpriseId: string) {
  const queryClient = useQueryClient()
  return useMutationWithToast({
    mutationFn: (input: CreateUserRequest) =>
      createUserService(enterpriseId, input),
    successMessage: "Utilizador criado com sucesso.",
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users", enterpriseId] })
    },
  })
}

export function useUpdateUserMutation(enterpriseId: string, userId: string) {
  const queryClient = useQueryClient()
  return useMutationWithToast({
    mutationFn: (input: UpdateUserRequest) =>
      updateUserService(enterpriseId, userId, input),
    successMessage: "Perfil atualizado com sucesso!",
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users", enterpriseId] })
      void queryClient.invalidateQueries({ queryKey: ["account", "me"] })
    },
  })
}
