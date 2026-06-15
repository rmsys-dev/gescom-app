import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/cookie-names"
import {
  isProtectedPage,
  shouldRedirectAuthRouteWithSession,
} from "@/lib/routing/route-access"

export function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get(REFRESH_TOKEN_COOKIE)?.value)
  const { pathname } = req.nextUrl

  if (isProtectedPage(pathname) && !hasSession) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  if (hasSession && shouldRedirectAuthRouteWithSession(pathname)) {
    return NextResponse.redirect(new URL("/home", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
