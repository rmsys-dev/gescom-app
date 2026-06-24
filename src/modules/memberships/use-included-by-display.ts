"use client"

import { useMembersQuery } from "@/modules/memberships/use-members"
import { useUserQuery } from "@/modules/users/use-users"

export function useIncludedByDisplay(
  enterpriseId: string,
  includedBy?: string | null
) {
  const includedById = includedBy ?? undefined

  const {
    data: includedByMembers,
    isPending: includedByListPending,
    isFetched: includedByListFetched,
  } = useMembersQuery({
    enterpriseId,
    filters: { userId: includedById, limit: 1 },
    enabled: Boolean(enterpriseId) && Boolean(includedById),
  })

  const includedByNameFromList = includedByMembers?.items[0]?.user.userName

  const { data: includedByUser, isPending: includedByUserPending } =
    useUserQuery({
      enterpriseId,
      userId: includedById,
      enabled:
        Boolean(enterpriseId) &&
        Boolean(includedById) &&
        includedByListFetched &&
        !includedByNameFromList,
      retry: false,
    })

  const display = includedByNameFromList ?? includedByUser?.userName
  const isPending =
    includedByListPending ||
    (includedByListFetched && !includedByNameFromList && includedByUserPending)

  return { display, isPending }
}
