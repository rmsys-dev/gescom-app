import { cookies } from "next/headers"
import { z } from "zod"
import {
  ACCESS_TOKEN_COOKIE,
  ENTERPRISES_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/cookie-names"
import {
  ACCESS_COOKIE_MAX_AGE,
  isAuthCookieSecure,
  REFRESH_COOKIE_MAX_AGE,
} from "@/lib/auth/env"
import {
  authEnterpriseSchema,
  type AuthEnterprise,
} from "@/modules/authentication/auth.schema"

export {
  ACCESS_TOKEN_COOKIE,
  ENTERPRISES_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/cookie-names"

function baseCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isAuthCookieSecure(),
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  }
}

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(ACCESS_TOKEN_COOKIE)?.value ?? null
}

export async function getRefreshToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(REFRESH_TOKEN_COOKIE)?.value ?? null
}

export async function getEnterprisesSnapshot(): Promise<AuthEnterprise[]> {
  const store = await cookies()
  const raw = store.get(ENTERPRISES_COOKIE)?.value
  if (!raw) return []
  try {
    const parsed = z.array(authEnterpriseSchema).safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
}

export async function setAuthCookies(
  tokens: { accessToken: string; refreshToken: string },
  enterprises?: AuthEnterprise[]
) {
  const store = await cookies()
  store.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...baseCookieOptions(ACCESS_COOKIE_MAX_AGE),
  })
  store.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...baseCookieOptions(REFRESH_COOKIE_MAX_AGE),
  })
  if (enterprises !== undefined) {
    store.set(ENTERPRISES_COOKIE, JSON.stringify(enterprises), {
      ...baseCookieOptions(REFRESH_COOKIE_MAX_AGE),
    })
  }
}

export async function clearAuthCookies() {
  const store = await cookies()
  store.delete(ACCESS_TOKEN_COOKIE)
  store.delete(REFRESH_TOKEN_COOKIE)
  store.delete(ENTERPRISES_COOKIE)
}
