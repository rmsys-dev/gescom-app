import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/cookie-names"

/** Rotas da área autenticada `(app_routes)` — o grupo não aparece na URL. */
const PRIVATE_ROUTE_PREFIXES = [
  "/home",
  "/profile",
  "/enterprise",
  "/members",
  "/clients",
  "/notifications",
  "/settings",
  "/support",
] as const

const AUTH_ROUTE_PREFIXES = [
  "/auth/login",
  "/auth/select-enterprise",
  "/auth/first-access",
  "/auth/password-reset",
  "/auth/invitation",
] as const

function isPrivateRoute(pathname: string) {
  return PRIVATE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get(REFRESH_TOKEN_COOKIE)?.value)
  const { pathname } = req.nextUrl

  if (isPrivateRoute(pathname) && !hasSession) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  if (
    isAuthRoute(pathname) &&
    hasSession &&
    (pathname === "/auth/login" || pathname === "/auth/select-enterprise")
  ) {
    return NextResponse.redirect(new URL("/home", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/home/:path*",
    "/profile/:path*",
    "/enterprise/:path*",
    "/members/:path*",
    "/clients/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/support/:path*",
    "/auth/login",
    "/auth/select-enterprise",
    "/auth/first-access/:path*",
    "/auth/password-reset/:path*",
    "/auth/invitation/:path*",
  ],
}
