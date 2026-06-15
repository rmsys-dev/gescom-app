import type { ListUsersQuery } from "@/modules/users/users.schema"

export function usersQueryKey(
  enterpriseId: string,
  filters?: ListUsersQuery
) {
  return ["users", enterpriseId, filters ?? {}] as const
}

export function userQueryKey(enterpriseId: string, userId: string) {
  return ["users", enterpriseId, userId] as const
}

export function userDetailsQueryKey(enterpriseId: string, userId: string) {
  return ["users", enterpriseId, userId, "details"] as const
}
