import type { ZodError, ZodIssue, ZodType } from "zod"

export class ApiContractError extends Error {
  readonly issues: ZodIssue[]
  readonly path: string

  constructor(message: string, issues: ZodIssue[], path = "response") {
    super(message)
    this.name = "ApiContractError"
    this.issues = issues
    this.path = path
  }

  static fromZodError(error: ZodError, path = "response"): ApiContractError {
    if (process.env.NODE_ENV === "development") {
      console.error("[ApiContractError]", path, error.issues)
    }
    return new ApiContractError(
      "Resposta inesperada do servidor.",
      error.issues,
      path
    )
  }
}

export function parseSchema<T>(schema: ZodType<T>, raw: unknown, path?: string): T {
  const result = schema.safeParse(raw)
  if (!result.success) {
    throw ApiContractError.fromZodError(result.error, path)
  }
  return result.data
}
