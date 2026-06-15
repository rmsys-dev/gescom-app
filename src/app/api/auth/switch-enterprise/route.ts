import { NextResponse } from "next/server"
import { enforceRateLimit } from "@/lib/api/with-rate-limit"
import { setAuthCookies } from "@/lib/auth/cookies"
import { jsonError } from "@/lib/auth/route-utils"
import { apiServerFetch } from "@/lib/auth/server-fetch"
import { switchEnterpriseClientResponseSchema } from "@/lib/auth/session-response"
import { HttpError } from "@/lib/api/http-error"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import {
  switchEnterpriseRequestSchema,
  switchEnterpriseResponseSchema,
} from "@/modules/authentication/auth.schema"

export async function POST(req: Request) {
  const rateLimited = enforceRateLimit(
    req,
    "auth/switch-enterprise",
    20,
    15 * 60 * 1000
  )
  if (rateLimited) {
    return rateLimited
  }

  try {
    const body = switchEnterpriseRequestSchema.parse(await req.json())
    const res = await apiServerFetch("auth/switch-enterprise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw await HttpError.fromResponse(res)
    }

    const apiPayload = successEnvelopeSchema(switchEnterpriseResponseSchema).parse(
      await res.json()
    ).data
    await setAuthCookies({
      accessToken: apiPayload.accessToken,
      refreshToken: apiPayload.refreshToken,
    })

    const clientPayload = switchEnterpriseClientResponseSchema.parse({
      enterprise: apiPayload.enterprise,
    })

    return NextResponse.json(clientPayload)
  } catch (error) {
    return jsonError(error)
  }
}
