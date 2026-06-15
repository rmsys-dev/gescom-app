"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CACHE } from "@/lib/react-query/cache-policy"
import { useMutationWithToast } from "@/lib/react-query/use-mutation-with-toast"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"
import {
  memberQueryKey,
  membersQueryKey,
} from "@/modules/memberships/memberships-query-keys"
import {
  addMemberDepartmentService,
  createMemberService,
  createMemberWithUserService,
  getMemberService,
  inviteMemberService,
  listMembersService,
  updateMemberDepartmentService,
  updateMemberExtraPermissionService,
  updateMemberPermissionDefaultService,
  updateMemberService,
} from "@/modules/memberships/memberships.service"

export { memberQueryKey, membersQueryKey } from "@/modules/memberships/memberships-query-keys"

export function useMembersQuery({
  enterpriseId,
  filters = {},
  enabled = true,
}: {
  enterpriseId: string | undefined
  filters?: ListMembersQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: membersQueryKey(enterpriseId ?? "", filters),
    queryFn: () => listMembersService(enterpriseId!, filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: CACHE.tenantList,
  })
}

export function useMemberQuery({
  enterpriseId,
  memberId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  memberId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: memberQueryKey(enterpriseId ?? "", memberId ?? ""),
    queryFn: () => getMemberService(enterpriseId!, memberId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(memberId),
    staleTime: CACHE.tenantDetail,
  })
}

function useInvalidateMembers(enterpriseId: string, memberId?: string) {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({
      queryKey: ["memberships", enterpriseId],
    })
    if (memberId) {
      void queryClient.invalidateQueries({
        queryKey: memberQueryKey(enterpriseId, memberId),
      })
    }
  }
}

export function useCreateMemberWithUserMutation(enterpriseId: string) {
  const invalidate = useInvalidateMembers(enterpriseId)
  return useMutationWithToast({
    mutationFn: createMemberWithUserService.bind(null, enterpriseId),
    successMessage: "Membro criado com sucesso.",
    onSuccess: () => invalidate(),
  })
}

export function useInviteMemberMutation(enterpriseId: string) {
  const invalidate = useInvalidateMembers(enterpriseId)
  return useMutationWithToast({
    mutationFn: inviteMemberService.bind(null, enterpriseId),
    successMessage: "Convite enviado com sucesso.",
    onSuccess: () => invalidate(),
  })
}

export function useCreateMemberMutation(enterpriseId: string) {
  const invalidate = useInvalidateMembers(enterpriseId)
  return useMutationWithToast({
    mutationFn: createMemberService.bind(null, enterpriseId),
    successMessage: "Vinculo criado com sucesso.",
    onSuccess: () => invalidate(),
  })
}

export function useUpdateMemberMutation(
  enterpriseId: string,
  memberId: string
) {
  const invalidate = useInvalidateMembers(enterpriseId, memberId)
  return useMutationWithToast({
    mutationFn: (input: Parameters<typeof updateMemberService>[2]) =>
      updateMemberService(enterpriseId, memberId, input),
    onSuccess: (_, variables) => {
      invalidate()
      if (variables.softDelete) {
        toast.success("Membro inativado.")
      } else {
        toast.success("Membro atualizado.")
      }
    },
  })
}

export function useAddMemberDepartmentMutation(
  enterpriseId: string,
  memberId: string
) {
  const invalidate = useInvalidateMembers(enterpriseId, memberId)
  return useMutationWithToast({
    mutationFn: (input: Parameters<typeof addMemberDepartmentService>[2]) =>
      addMemberDepartmentService(enterpriseId, memberId, input),
    successMessage: "Departamento vinculado.",
    onSuccess: () => invalidate(),
  })
}

export function useUpdateMemberDepartmentMutation(
  enterpriseId: string,
  memberId: string
) {
  const invalidate = useInvalidateMembers(enterpriseId, memberId)
  return useMutationWithToast({
    mutationFn: ({
      memberDepartmentId,
      input,
    }: {
      memberDepartmentId: string
      input: Parameters<typeof updateMemberDepartmentService>[3]
    }) =>
      updateMemberDepartmentService(
        enterpriseId,
        memberId,
        memberDepartmentId,
        input
      ),
    onSuccess: (_, variables) => {
      invalidate()
      if (variables.input.softDelete) {
        toast.success("Vinculo de departamento removido.")
      } else {
        toast.success("Departamento actualizado.")
      }
    },
  })
}

export function useUpdateMemberPermissionDefaultMutation(
  enterpriseId: string,
  memberId: string
) {
  const invalidateMembers = useInvalidateMembers(enterpriseId, memberId)
  const queryClient = useQueryClient()
  return useMutationWithToast({
    mutationFn: ({
      departmentId,
      input,
    }: {
      departmentId: string
      input: Parameters<typeof updateMemberPermissionDefaultService>[3]
    }) =>
      updateMemberPermissionDefaultService(
        enterpriseId,
        memberId,
        departmentId,
        input
      ),
    onSuccess: (_, variables) => {
      invalidateMembers()
      void queryClient.invalidateQueries({ queryKey: ["account", "me"] })
      if (variables.input.softDelete) {
        toast.success("Permissão padrão removida.")
      } else if (variables.input.status === "ALLOW") {
        toast.success("Permissão ativada.")
      } else {
        toast.success("Permissão bloqueada.")
      }
    },
  })
}

export function useUpdateMemberExtraPermissionMutation(
  enterpriseId: string,
  memberId: string
) {
  const invalidateMembers = useInvalidateMembers(enterpriseId, memberId)
  const queryClient = useQueryClient()
  return useMutationWithToast({
    mutationFn: ({
      departmentId,
      input,
    }: {
      departmentId: string
      input: Parameters<typeof updateMemberExtraPermissionService>[3]
    }) =>
      updateMemberExtraPermissionService(
        enterpriseId,
        memberId,
        departmentId,
        input
      ),
    onSuccess: (_, variables) => {
      invalidateMembers()
      void queryClient.invalidateQueries({ queryKey: ["account", "me"] })
      if (variables.input.softDelete) {
        toast.success("Permissão extra removida.")
      } else if (variables.input.status === "ALLOW") {
        toast.success("Permissão ativada.")
      } else {
        toast.success("Permissão bloqueada.")
      }
    },
  })
}
