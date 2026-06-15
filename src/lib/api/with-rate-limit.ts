import { NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) {
      return first
    }
  }
  return req.headers.get("x-real-ip") ?? "unknown"
}

export function enforceRateLimit(
  req: Request,
  routeKey: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const ip = getClientIp(req)
  const key = `${routeKey}:${ip}`
  const result = checkRateLimit(key, limit, windowMs)

  if (result.allowed) {
    return null
  }

  const retryAfter = result.retryAfterSeconds ?? 60
  return NextResponse.json(
    {
      requestId: null,
      code: "RATE_LIMITED",
      message: "Muitas tentativas. Tente mais tarde.",
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    }
  )
}
