"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CACHE } from "@/lib/react-query/cache-policy"
import { useMutationWithToast } from "@/lib/react-query/use-mutation-with-toast"
import { HttpError } from "@/lib/api/http-error"
import { memberQueryKey } from "@/modules/memberships/memberships-query-keys"
import { userDetailsQueryKey } from "@/modules/users/users-query-keys"
import {
  getUserDetailsService,
  patchFinancialInfoService,
  patchPersonalInfoService,
  patchRelationshipsService,
  patchTaxInfosService,
  patchUserAddressService,
  patchUserContactService,
  postFinancialInfoService,
  postPersonalInfoService,
  postRelationshipsService,
  postTaxInfosService,
  postUserAddressService,
  postUserContactService,
} from "@/modules/users-onboarding/users-onboarding.service"
import type {
  PatchFinancialInfoRequest,
  PatchPersonalInfoRequest,
  PatchRelationshipsRequest,
  PatchTaxInfosRequest,
  PatchUserAddressRequest,
  PatchUserContactRequest,
  PostFinancialInfoRequest,
  PostPersonalInfoRequest,
  PostRelationshipsRequest,
  PostTaxInfosRequest,
  PostUserAddressRequest,
  PostUserContactRequest,
} from "@/modules/users-onboarding/users-onboarding.schema"

export { userDetailsQueryKey } from "@/modules/users/users-query-keys"

function useInvalidateUserDetails(
  enterpriseId: string,
  userId: string,
  memberId?: string
) {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({
      queryKey: userDetailsQueryKey(enterpriseId, userId),
    })
    void queryClient.invalidateQueries({ queryKey: ["account", "me"] })
    if (memberId) {
      void queryClient.invalidateQueries({
        queryKey: memberQueryKey(enterpriseId, memberId),
      })
    }
  }
}

export function useUserDetailsQuery({
  enterpriseId,
  userId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  userId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: userDetailsQueryKey(enterpriseId ?? "", userId ?? ""),
    queryFn: async () => {
      try {
        return await getUserDetailsService(enterpriseId!, userId!)
      } catch (error) {
        if (error instanceof HttpError && error.status === 404) {
          return null
        }
        throw error
      }
    },
    enabled: enabled && Boolean(enterpriseId) && Boolean(userId),
    staleTime: CACHE.tenantDetail,
    retry: (failureCount, error) => {
      if (error instanceof HttpError && error.status === 404) {
        return false
      }
      return failureCount < 3
    },
  })
}

export function useUpsertPersonalInfoMutation(
  enterpriseId: string,
  userId: string,
  memberId?: string
) {
  const invalidate = useInvalidateUserDetails(enterpriseId, userId, memberId)
  return useMutationWithToast({
    mutationFn: ({
      exists,
      input,
    }: {
      exists: boolean
      input: PostPersonalInfoRequest | PatchPersonalInfoRequest
    }) =>
      exists
        ? patchPersonalInfoService(
            enterpriseId,
            userId,
            input as PatchPersonalInfoRequest
          )
        : postPersonalInfoService(
            enterpriseId,
            userId,
            input as PostPersonalInfoRequest
          ),
    successMessage: "Informações pessoais registradas!",
    onSuccess: () => invalidate(),
  })
}

export function useCreateUserAddressMutation(
  enterpriseId: string,
  userId: string,
  memberId?: string
) {
  const invalidate = useInvalidateUserDetails(enterpriseId, userId, memberId)
  return useMutationWithToast({
    mutationFn: (input: PostUserAddressRequest) =>
      postUserAddressService(enterpriseId, userId, input),
    successMessage: "Endereço adicionado!",
    onSuccess: () => invalidate(),
  })
}

export function usePatchUserAddressMutation(
  enterpriseId: string,
  userId: string,
  memberId?: string
) {
  const invalidate = useInvalidateUserDetails(enterpriseId, userId, memberId)
  return useMutationWithToast({
    mutationFn: ({
      addressId,
      input,
    }: {
      addressId: string
      input: PatchUserAddressRequest
    }) => patchUserAddressService(enterpriseId, userId, addressId, input),
    onSuccess: (_, variables) => {
      invalidate()
      if (variables.input.softDelete) {
        toast.success("Endereço removido!")
      } else {
        toast.success("Endereço atualizado!")
      }
    },
  })
}

export function useCreateUserContactMutation(
  enterpriseId: string,
  userId: string,
  memberId?: string
) {
  const invalidate = useInvalidateUserDetails(enterpriseId, userId, memberId)
  return useMutationWithToast({
    mutationFn: (input: PostUserContactRequest) =>
      postUserContactService(enterpriseId, userId, input),
    successMessage: "Contato adicionado!",
    onSuccess: () => invalidate(),
  })
}

export function usePatchUserContactMutation(
  enterpriseId: string,
  userId: string,
  memberId?: string
) {
  const invalidate = useInvalidateUserDetails(enterpriseId, userId, memberId)
  return useMutationWithToast({
    mutationFn: ({
      contactId,
      input,
    }: {
      contactId: string
      input: PatchUserContactRequest
    }) => patchUserContactService(enterpriseId, userId, contactId, input),
    onSuccess: (_, variables) => {
      invalidate()
      if (variables.input.softDelete) {
        toast.success("Contato removido!")
      } else {
        toast.success("Contato atualizado!")
      }
    },
  })
}

export function useUpsertRelationshipsMutation(
  enterpriseId: string,
  userId: string,
  memberId?: string
) {
  const invalidate = useInvalidateUserDetails(enterpriseId, userId, memberId)
  return useMutationWithToast({
    mutationFn: ({
      exists,
      input,
    }: {
      exists: boolean
      input: PostRelationshipsRequest | PatchRelationshipsRequest
    }) =>
      exists
        ? patchRelationshipsService(
            enterpriseId,
            userId,
            input as PatchRelationshipsRequest
          )
        : postRelationshipsService(
            enterpriseId,
            userId,
            input as PostRelationshipsRequest
          ),
    successMessage: "Relacionamentos registrados!",
    onSuccess: () => invalidate(),
  })
}

export function useUpsertTaxInfosMutation(
  enterpriseId: string,
  userId: string,
  memberId?: string
) {
  const invalidate = useInvalidateUserDetails(enterpriseId, userId, memberId)
  return useMutationWithToast({
    mutationFn: ({
      exists,
      input,
    }: {
      exists: boolean
      input: PostTaxInfosRequest | PatchTaxInfosRequest
    }) =>
      exists
        ? patchTaxInfosService(
            enterpriseId,
            userId,
            input as PatchTaxInfosRequest
          )
        : postTaxInfosService(enterpriseId, userId, input as PostTaxInfosRequest),
    successMessage: "Informações fiscais registradas!",
    onSuccess: () => invalidate(),
  })
}

export function useUpsertFinancialInfoMutation(
  enterpriseId: string,
  userId: string,
  memberId?: string
) {
  const invalidate = useInvalidateUserDetails(enterpriseId, userId, memberId)
  return useMutationWithToast({
    mutationFn: ({
      exists,
      input,
    }: {
      exists: boolean
      input: PostFinancialInfoRequest | PatchFinancialInfoRequest
    }) =>
      exists
        ? patchFinancialInfoService(
            enterpriseId,
            userId,
            input as PatchFinancialInfoRequest
          )
        : postFinancialInfoService(
            enterpriseId,
            userId,
            input as PostFinancialInfoRequest
          ),
    successMessage: "Informações financeiras registradas!",
    onSuccess: () => invalidate(),
  })
}
