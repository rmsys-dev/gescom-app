"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CACHE } from "@/lib/react-query/cache-policy"
import { useAuthSession } from "@/lib/auth/use-auth-session"
import {
  getEnterpriseByIdService,
  updateEnterpriseService,
} from "@/modules/enterprises/enterprises.service"
import { enterpriseDetailQueryKey } from "@/modules/enterprises/enterprises-query-keys"
import type {
  EnterpriseDetail,
  UpdateEnterpriseRequest,
} from "@/modules/enterprises/enterprises.schema"

export { enterpriseDetailQueryKey } from "@/modules/enterprises/enterprises-query-keys"

export function useEnterpriseDetailQuery({
  enterpriseId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: enterpriseDetailQueryKey(enterpriseId ?? ""),
    queryFn: () => getEnterpriseByIdService(enterpriseId!),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantDetail,
  })
}

export function useUpdateEnterpriseMutation(enterpriseId: string) {
  const queryClient = useQueryClient()
  const { refreshSession } = useAuthSession()

  return useMutation({
    mutationFn: (input: UpdateEnterpriseRequest) =>
      updateEnterpriseService(enterpriseId, input),
    onSuccess: async (data) => {
      queryClient.setQueryData<EnterpriseDetail | undefined>(
        enterpriseDetailQueryKey(enterpriseId),
        (previous) =>
          previous
            ? { ...previous, ...data }
            : undefined
      )
      void queryClient.invalidateQueries({ queryKey: ["account", "me"] })
      try {
        await refreshSession()
      } catch {
        // Mantém sucesso da alteração mesmo se a sincronização da sessão falhar
      }
      toast.success("Empresa atualizada com sucesso.")
    },
  })
}
