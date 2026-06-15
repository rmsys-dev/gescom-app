import { apiFetch } from "@/lib/api/client"
import { fetchAllPages } from "@/lib/api/fetch-all-pages"
import {
  parsePaginatedEnvelope,
  parseSuccessEnvelope,
} from "@/lib/api/parse-response"
import {
  USERS_API_LIST_LIMIT,
  USERS_MAX_FETCH_PAGES,
} from "@/modules/users/users-rules"
import {
  listUsersQuerySchema,
  userPublicSchema,
  createUserRequestSchema,
  createUserResponseSchema,
  updateUserRequestSchema,
  updateUserResponseSchema,
  type CreateUserRequest,
  type ListUsersQuery,
  type UpdateUserRequest,
} from "@/modules/users/users.schema"

function usersBase(enterpriseId: string) {
  return `enterprises/${enterpriseId}/users`
}

function buildUsersQuery(query: ListUsersQuery): string {
  const parsed = listUsersQuerySchema.parse(query)
  const params = new URLSearchParams()
  if (parsed.registration) params.set("registration", parsed.registration)
  if (parsed.email) params.set("email", parsed.email)
  if (parsed.phone) params.set("phone", parsed.phone)
  if (parsed.userName) params.set("userName", parsed.userName)
  if (parsed.limit !== undefined) params.set("limit", String(parsed.limit))
  if (parsed.offset !== undefined) params.set("offset", String(parsed.offset))
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export async function listUsersService(
  enterpriseId: string,
  query: ListUsersQuery = {}
) {
  const raw = await apiFetch<unknown>(
    `${usersBase(enterpriseId)}${buildUsersQuery(query)}`,
    { method: "GET" }
  )
  return parsePaginatedEnvelope(raw, userPublicSchema, "GET /users")
}

export async function getUserService(enterpriseId: string, userId: string) {
  const raw = await apiFetch<unknown>(
    `${usersBase(enterpriseId)}/${userId}`,
    { method: "GET" }
  )
  return parseSuccessEnvelope(raw, userPublicSchema, `GET /users/${userId}`)
}

export async function createUserService(
  enterpriseId: string,
  input: CreateUserRequest
) {
  const body = createUserRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(usersBase(enterpriseId), {
    method: "POST",
    body,
  })
  return parseSuccessEnvelope(
    raw,
    createUserResponseSchema,
    "POST /users"
  )
}

export async function listAllUsersService(
  enterpriseId: string,
  query: Omit<ListUsersQuery, "limit" | "offset"> = {},
  options?: { signal?: AbortSignal }
) {
  return fetchAllPages({
    pageSize: USERS_API_LIST_LIMIT,
    maxPages: USERS_MAX_FETCH_PAGES,
    signal: options?.signal,
    fetchPage: (offset, limit) =>
      listUsersService(enterpriseId, { ...query, limit, offset }),
  })
}

export async function updateUserService(
  enterpriseId: string,
  userId: string,
  input: UpdateUserRequest
) {
  const body = updateUserRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${usersBase(enterpriseId)}/${userId}`,
    { method: "PATCH", body }
  )
  return parseSuccessEnvelope(
    raw,
    updateUserResponseSchema,
    `PATCH /users/${userId}`
  )
}
