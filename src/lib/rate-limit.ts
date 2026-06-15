type RateLimitEntry = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitEntry>()

export type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds?: number
}

/**
 * Rate limiter in-memory (adequado para instância única).
 * Em deploy multi-instância, usar store partilhado (ex.: Redis).
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (entry.count >= limit) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfterSeconds }
  }

  entry.count += 1
  return { allowed: true }
}

/** Limpa estado entre testes. */
export function resetRateLimitStore() {
  buckets.clear()
}
