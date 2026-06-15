export const PUBLIC_PAGE_PREFIXES = ["/auth"] as const
export const PUBLIC_EXACT_PATHS = ["/"] as const

export function isPublicPage(pathname: string): boolean {
  if ((PUBLIC_EXACT_PATHS as readonly string[]).includes(pathname)) {
    return true
  }
  return PUBLIC_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function isProtectedPage(pathname: string): boolean {
  return !isPublicPage(pathname)
}

const AUTH_REDIRECT_WHEN_SESSION_PREFIXES = [
  "/auth/login",
  "/auth/select-enterprise",
] as const

export function shouldRedirectAuthRouteWithSession(pathname: string): boolean {
  return AUTH_REDIRECT_WHEN_SESSION_PREFIXES.some(
    (prefix) => pathname === prefix
  )
}
