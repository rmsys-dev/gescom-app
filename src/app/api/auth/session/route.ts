import { NextResponse } from "next/server"
import {
  clearAuthCookies,
  getEnterprisesSnapshot,
  getRefreshToken,
} from "@/lib/auth/cookies"
import { fetchAuthMeResponse } from "@/lib/auth/fetch-auth-me"
import { jsonError } from "@/lib/auth/route-utils"
import { sessionBootstrapSchema } from "@/lib/auth/session-response"
import { HttpError } from "@/lib/api/http-error"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import { meResponseSchema } from "@/modules/authentication/auth.schema"

export async function GET() {
  try {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) {
      return NextResponse.json({ authenticated: false })
    }

    const res = await fetchAuthMeResponse()

    if (!res.ok) {
      if (res.status === 401) {
        await clearAuthCookies()
        return NextResponse.json({ authenticated: false })
      }
      throw await HttpError.fromResponse(res)
    }

    const me = successEnvelopeSchema(meResponseSchema).parse(await res.json()).data
    const enterprises = await getEnterprisesSnapshot()

    const payload = sessionBootstrapSchema.parse({
      authenticated: true,
      user: me.user,
      enterprise: me.enterprise,
      departments: me.departments,
      permissions: me.permissions,
      enterprises,
    })

    return NextResponse.json(payload)
  } catch (error) {
    return jsonError(error)
  }
}
