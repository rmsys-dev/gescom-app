import { HttpError } from "@/lib/api/http-error"

const ALL_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const
type HttpMethod = (typeof ALL_METHODS)[number]

type ProxyAllowRule = {
  /** Prefixo do path da API (sem query string). Fonte: services em `src/modules/`. */
  prefix: string
  methods?: readonly HttpMethod[]
}

/**
 * Allowlist de paths encaminhados pelo BFF `/api/proxy/*`.
 * Ao adicionar um novo `apiFetch` num service, registar o prefixo aqui.
 */
const PROXY_ALLOW_RULES: readonly ProxyAllowRule[] = [
  // addresses.service.ts
  { prefix: "addresses/", methods: ["GET"] },
  // departments.service.ts
  { prefix: "departments", methods: ALL_METHODS },
  // enterprises.service.ts, enterprise-addresses.service.ts
  { prefix: "enterprises/", methods: ALL_METHODS },
  // products.service.ts
  { prefix: "products", methods: ALL_METHODS },
  { prefix: "products-enterprises", methods: ALL_METHODS },
  { prefix: "prices", methods: ALL_METHODS },
  { prefix: "promotional-prices", methods: ALL_METHODS },
  { prefix: "product-taxation", methods: ALL_METHODS },
  { prefix: "product-applications", methods: ALL_METHODS },
  { prefix: "units", methods: ALL_METHODS },
  { prefix: "types-products", methods: ALL_METHODS },
  { prefix: "products-ncm", methods: ALL_METHODS },
  { prefix: "products-cest", methods: ALL_METHODS },
  { prefix: "products-anp", methods: ALL_METHODS },
  { prefix: "products-nbs", methods: ALL_METHODS },
  { prefix: "icms-taxation", methods: ALL_METHODS },
  { prefix: "product-groups", methods: ALL_METHODS },
  { prefix: "product-subgroups", methods: ALL_METHODS },
  { prefix: "product-brands", methods: ALL_METHODS },
  { prefix: "pis-cofins-situation", methods: ALL_METHODS },
  // sales.service.ts
  { prefix: "sales", methods: ALL_METHODS },
  { prefix: "payment-types", methods: ALL_METHODS },
  // sales-analytics.service.ts
  { prefix: "sales/analytics/", methods: ["GET"] },
  // stock.service.ts
  { prefix: "stock-sectors", methods: ALL_METHODS },
  { prefix: "stock-locations", methods: ALL_METHODS },
  { prefix: "stock-batches", methods: ALL_METHODS },
  { prefix: "stock-sectors-rental", methods: ALL_METHODS },
  { prefix: "stock-batch-balances", methods: ALL_METHODS },
  { prefix: "stock-min-max", methods: ALL_METHODS },
  { prefix: "stock-movements", methods: ALL_METHODS },
]

function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0] ?? path
  return withoutQuery.replace(/^\/+/, "").replace(/\/+$/, "")
}

function matchesPrefix(path: string, prefix: string): boolean {
  if (path === prefix) {
    return true
  }
  if (prefix.endsWith("/")) {
    return path.startsWith(prefix)
  }
  return path.startsWith(`${prefix}/`)
}

export function isProxyPathAllowed(method: string, path: string): boolean {
  const normalizedPath = normalizePath(path)
  const upperMethod = method.toUpperCase()

  return PROXY_ALLOW_RULES.some((rule) => {
    if (!matchesPrefix(normalizedPath, rule.prefix)) {
      return false
    }
    const allowedMethods = rule.methods ?? ALL_METHODS
    return allowedMethods.includes(upperMethod as HttpMethod)
  })
}

export function assertProxyPathAllowed(method: string, path: string): void {
  if (isProxyPathAllowed(method, path)) {
    return
  }

  throw new HttpError(
    403,
    "PROXY_PATH_FORBIDDEN",
    "Este recurso nao esta disponivel atraves do proxy."
  )
}
