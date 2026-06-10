import { NextResponse } from "next/server"
import { fetchAuthMeResponse } from "@/lib/auth/fetch-auth-me"
import { jsonError } from "@/lib/auth/route-utils"
import { HttpError } from "@/lib/api/http-error"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import { meResponseSchema } from "@/modules/authentication/auth.schema"

export async function GET() {
  try {
    const res = await fetchAuthMeResponse()

    if (!res.ok) {
      throw await HttpError.fromResponse(res)
    }

    const payload = successEnvelopeSchema(meResponseSchema).parse(await res.json())
      .data
    return NextResponse.json(payload)
  } catch (error) {
    return jsonError(error)
  }
}
