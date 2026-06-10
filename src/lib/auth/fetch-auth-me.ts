import { clearAuthCookies, getRefreshToken } from "@/lib/auth/cookies"
import { apiServerFetch, ensureAccessToken, refreshTokensOnce } from "@/lib/auth/server-fetch"

/**
 * Obtém `GET auth/me` com refresh proativo e retry alinhado ao bootstrap de sessão.
 */
export async function fetchAuthMeResponse(): Promise<Response> {
  const refreshToken = await getRefreshToken()
  if (!refreshToken) {
    return new Response(
      JSON.stringify({
        requestId: null,
        code: "INVALID_SESSION",
        message: "Sessão não encontrada.",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }

  await ensureAccessToken()

  let res = await apiServerFetch("auth/me", { method: "GET" })

  if (res.status === 401) {
    try {
      await refreshTokensOnce()
      res = await apiServerFetch("auth/me", { method: "GET", _retry: true })
    } catch {
      await clearAuthCookies()
    }
  }

  return res
}
