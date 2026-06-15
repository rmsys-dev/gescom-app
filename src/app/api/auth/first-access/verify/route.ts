import { NextResponse } from "next/server"
import { enforceRateLimit } from "@/lib/api/with-rate-limit"
import { setAuthCookies } from "@/lib/auth/cookies"
import { enterprisesSnapshotFromMe } from "@/lib/auth/enterprise-snapshot"
import { getApiTimeoutMs, getServerApiBaseUrl } from "@/lib/auth/env"
import { jsonError } from "@/lib/auth/route-utils"
import { firstAccessVerifyClientResponseSchema } from "@/lib/auth/session-response"
import { HttpError } from "@/lib/api/http-error"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import { meResponseSchema } from "@/modules/authentication/auth.schema"
import {
  firstAccessVerifyRequestSchema,
  firstAccessVerifyResponseSchema,
} from "@/modules/authentication/first-access.schema"

export async function POST(req: Request) {
  const rateLimited = enforceRateLimit(
    req,
    "auth/first-access/verify",
    5,
    15 * 60 * 1000
  )
  if (rateLimited) {
    return rateLimited
  }

  try {
    const body = firstAccessVerifyRequestSchema.parse(await req.json())
    const res = await fetch(`${getServerApiBaseUrl()}/auth/first-access/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(getApiTimeoutMs()),
    })

    if (!res.ok) {
      throw await HttpError.fromResponse(res)
    }

    const apiPayload = successEnvelopeSchema(firstAccessVerifyResponseSchema).parse(
      await res.json()
    ).data
    let enterprisesSnapshot: ReturnType<typeof enterprisesSnapshotFromMe> = []
    try {
      const meRes = await fetch(`${getServerApiBaseUrl()}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiPayload.accessToken}`,
        },
        signal: AbortSignal.timeout(getApiTimeoutMs()),
      })
      if (meRes.ok) {
        const me = successEnvelopeSchema(meResponseSchema).parse(
          await meRes.json()
        ).data
        enterprisesSnapshot = enterprisesSnapshotFromMe(me)
      }
    } catch {
      // Sessão válida mesmo sem hidratar lista de empresas
    }

    await setAuthCookies(
      {
        accessToken: apiPayload.accessToken,
        refreshToken: apiPayload.refreshToken,
      },
      enterprisesSnapshot
    )

    const clientPayload = firstAccessVerifyClientResponseSchema.parse({
      user: apiPayload.user,
    })

    return NextResponse.json(clientPayload)
  } catch (error) {
    return jsonError(error)
  }
}
