import type { ZodType } from "zod"

import { parseSchema } from "@/lib/api/contract-error"
import {
  paginatedEnvelopeSchema,
  successEnvelopeSchema,
} from "@/lib/api/envelope"

export function parseSuccessEnvelope<T>(
  raw: unknown,
  dataSchema: ZodType<T>,
  path?: string
): T {
  return parseSchema(successEnvelopeSchema(dataSchema), raw, path).data
}

export function parsePaginatedEnvelope<T>(
  raw: unknown,
  itemSchema: ZodType<T>,
  path?: string
) {
  const envelope = parseSchema(
    paginatedEnvelopeSchema(itemSchema),
    raw,
    path
  )
  return { items: envelope.data, ...envelope.pagination }
}
