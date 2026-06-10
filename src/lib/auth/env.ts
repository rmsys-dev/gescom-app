import { getApiTimeoutMs as getSharedTimeoutMs } from "@/lib/api/env"

/**
 * URL base da Gescom API (com `/api/v1`), só no servidor (Route Handlers / BFF).
 */
export function getServerApiBaseUrl(): string {
  const raw =
    process.env.API_URL?.trim() ?? process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!raw) {
    throw new Error(
      "API_URL (ou NEXT_PUBLIC_API_URL) nao definido. Copie .env.example para .env.local."
    )
  }
  return raw.replace(/\/+$/, "")
}

export function getApiTimeoutMs(): number {
  return getSharedTimeoutMs()
}

export function isAuthCookieSecure(): boolean {
  if (process.env.AUTH_COOKIE_SECURE === "true") return true
  if (process.env.AUTH_COOKIE_SECURE === "false") return false
  return process.env.NODE_ENV === "production"
}

const DAY_SECONDS = 24 * 60 * 60

/** 7 dias — alinhado a JWT_ACCESS_EXPIRES_IN da API. */
export const ACCESS_COOKIE_MAX_AGE = 7 * DAY_SECONDS

/** 14 dias — alinhado a JWT_REFRESH_EXPIRES_IN da API. */
export const REFRESH_COOKIE_MAX_AGE = 14 * DAY_SECONDS
