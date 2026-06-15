import { NextResponse } from "next/server"
import { enforceRateLimit } from "@/lib/api/with-rate-limit"
import { getApiTimeoutMs, getServerApiBaseUrl } from "@/lib/auth/env"
import { jsonError } from "@/lib/auth/route-utils"
import { HttpError } from "@/lib/api/http-error"
import { parseApiAckEnvelope } from "@/lib/auth/ack-route"
import { passwordResetVerifyRequestSchema } from "@/modules/authentication/password-reset.schema"

export async function POST(req: Request) {
  const rateLimited = enforceRateLimit(
    req,
    "auth/password-reset/verify",
    5,
    15 * 60 * 1000
  )
  if (rateLimited) {
    return rateLimited
  }

  try {
    const body = passwordResetVerifyRequestSchema.parse(await req.json())
    const res = await fetch(`${getServerApiBaseUrl()}/auth/password-reset/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(getApiTimeoutMs()),
    })

    if (!res.ok) {
      throw await HttpError.fromResponse(res)
    }

    const payload = parseApiAckEnvelope(await res.json())
    return NextResponse.json(payload)
  } catch (error) {
    return jsonError(error)
  }
}
