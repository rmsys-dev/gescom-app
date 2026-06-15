import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"

export function membersQueryKey(
  enterpriseId: string,
  filters?: ListMembersQuery
) {
  return ["memberships", enterpriseId, filters ?? {}] as const
}

export function memberQueryKey(enterpriseId: string, memberId: string) {
  return ["memberships", enterpriseId, memberId] as const
}
