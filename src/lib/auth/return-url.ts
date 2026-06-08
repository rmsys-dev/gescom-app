/** Monta URL interna com `returnUrl` para fluxos de auth (login, select-enterprise). */
export function withReturnUrl(path: string, returnUrl: string) {
  const params = new URLSearchParams({ returnUrl })
  return `${path}?${params.toString()}`
}

export function isSafeInternalReturnUrl(value: string | null): value is string {
  return Boolean(value?.startsWith("/auth/") || value?.startsWith("/home"))
}
