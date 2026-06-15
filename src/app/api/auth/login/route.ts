import { NextResponse } from "next/server"
import { enforceRateLimit } from "@/lib/api/with-rate-limit"
import { setAuthCookies } from "@/lib/auth/cookies"
import { getApiTimeoutMs, getServerApiBaseUrl } from "@/lib/auth/env"
import { jsonError } from "@/lib/auth/route-utils"
import { loginClientResponseSchema } from "@/lib/auth/session-response"
import { HttpError } from "@/lib/api/http-error"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import {
  loginRequestSchema,
  loginResponseSchema,
} from "@/modules/authentication/auth.schema"

export async function POST(req: Request) {
  const rateLimited = enforceRateLimit(req, "auth/login", 10, 15 * 60 * 1000)
  if (rateLimited) {
    return rateLimited
  }

  try {
    const body = loginRequestSchema.parse(await req.json())
    const res = await fetch(`${getServerApiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(getApiTimeoutMs()),
    })

    if (!res.ok) {
      throw await HttpError.fromResponse(res)
    }

    const apiPayload = successEnvelopeSchema(loginResponseSchema).parse(
      await res.json()
    ).data
    await setAuthCookies(
      {
        accessToken: apiPayload.accessToken,
        refreshToken: apiPayload.refreshToken,
      },
      apiPayload.enterprises
    )

    const clientPayload = loginClientResponseSchema.parse({
      user: apiPayload.user,
      enterprises: apiPayload.enterprises,
    })

    return NextResponse.json(clientPayload)
  } catch (error) {
    return jsonError(error)
  }
}
