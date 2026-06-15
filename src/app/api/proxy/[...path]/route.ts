import { NextRequest, NextResponse } from "next/server"
import { assertProxyPathAllowed } from "@/lib/api/proxy-allowlist"
import { enforceRateLimit } from "@/lib/api/with-rate-limit"
import { clearAuthCookies } from "@/lib/auth/cookies"
import { SESSION_FATAL_CODES } from "@/lib/auth/session-fatal-codes"
import { apiServerFetch } from "@/lib/auth/server-fetch"
import { HttpError } from "@/lib/api/http-error"

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])

async function handleProxy(req: NextRequest, pathSegments: string[]) {
  const path = pathSegments.join("/")
  assertProxyPathAllowed(req.method, path)
  const query = req.nextUrl.search
  const apiPath = query ? `${path}${query}` : path

  const headers = new Headers()
  const contentType = req.headers.get("content-type")
  if (contentType) {
    headers.set("Content-Type", contentType)
  }
  const requestId = req.headers.get("x-request-id")
  if (requestId) {
    headers.set("x-request-id", requestId)
  }

  const init: RequestInit = {
    method: req.method,
    headers,
  }

  if (MUTATING_METHODS.has(req.method)) {
    const body = await req.text()
    if (body.length > 0) {
      init.body = body
    }
  }

  const res = await apiServerFetch(apiPath, init)

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 })
  }

  const responseHeaders = new Headers()
  const resContentType = res.headers.get("content-type")
  if (resContentType) {
    responseHeaders.set("Content-Type", resContentType)
  }
  const resRequestId = res.headers.get("x-request-id")
  if (resRequestId) {
    responseHeaders.set("x-request-id", resRequestId)
  }

  if (res.status === 401) {
    try {
      const body = (await res.clone().json()) as { code?: string }
      if (body.code && SESSION_FATAL_CODES.has(body.code)) {
        await clearAuthCookies()
      }
    } catch {
      /* empty */
    }
  }

  const text = await res.text()
  return new NextResponse(text, {
    status: res.status,
    headers: responseHeaders,
  })
}

function proxyErrorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      {
        requestId: error.requestId,
        code: error.code,
        message: error.message,
        details: error.details.length > 0 ? error.details : undefined,
      },
      { status: error.status }
    )
  }
  return NextResponse.json(
    { requestId: null, code: "INTERNAL_SERVER_ERROR", message: "Erro interno." },
    { status: 500 }
  )
}

type RouteContext = { params: Promise<{ path: string[] }> }

async function routeHandler(req: NextRequest, context: RouteContext) {
  const rateLimited = enforceRateLimit(req, "proxy", 120, 60 * 1000)
  if (rateLimited) {
    return rateLimited
  }

  try {
    const { path } = await context.params
    return await handleProxy(req, path)
  } catch (error) {
    return proxyErrorResponse(error)
  }
}

export const GET = routeHandler
export const POST = routeHandler
export const PUT = routeHandler
export const PATCH = routeHandler
export const DELETE = routeHandler
