import type { QueryClient } from "@tanstack/react-query"

/**
 * Roots de queryKey limpos ao trocar de empresa (`switchToEnterprise`).
 *
 * Cada chave tenant-scoped deve começar com um destes roots para ser removida.
 */
export const TENANT_QUERY_ROOTS = new Set([
  "sales",
  "sales-analytics",
  "products",
  "memberships",
  "users",
  "enterprises",
  "departments",
  "stock",
])

/**
 * Remove do cache todas as queries cujo `queryKey[0]` é um domínio tenant-scoped.
 *
 * **Limpos:** sales, sales-analytics, products, memberships, users, enterprises,
 * departments, stock (inclui sub-chaves como enterprises/:id/addresses).
 *
 * **Preservados intencionalmente:**
 * - `addresses` — catálogo geográfico global (partilhado entre tenants)
 * - `account` — re-seedado via `seedAccountMeQuery` antes do clear
 * - `auth` — sessão
 * - `header-weather` — UI
 */
export function clearTenantQueries(queryClient: QueryClient) {
  queryClient.removeQueries({
    predicate: (query) => {
      const root = query.queryKey[0]
      return typeof root === "string" && TENANT_QUERY_ROOTS.has(root)
    },
  })
}
