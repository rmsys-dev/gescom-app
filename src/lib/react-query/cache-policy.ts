/** Política central de staleTime para TanStack Query. */
export const CACHE = {
  /** Catálogos globais (países, unidades, NCM, etc.). Ver também GEO em addresses-cache. */
  globalCatalog: 15 * 60_000,
  /** Catálogos por tenant com baixa volatilidade (payment-types). */
  tenantCatalog: 5 * 60_000,
  /** Catálogos estáveis por tenant (departamentos ativos, etc.). */
  tenantStableCatalog: 15 * 60_000,
  /** Listagens transacionais por tenant. */
  tenantList: 30_000,
  /** Detalhes em edição ou dados altamente voláteis. */
  tenantDetail: 0,
  /** Sessão / conta do utilizador. */
  account: 5 * 60_000,
  /** Analytics e dashboards. */
  analytics: 60_000,
} as const

/** Política central de gcTime (tempo em cache após desmontar). */
export const GC = {
  globalCatalog: 30 * 60_000,
  tenantStableCatalog: 15 * 60_000,
  tenantCatalog: 15 * 60_000,
  tenantList: 5 * 60_000,
  tenantDetail: 2 * 60_000,
  account: 10 * 60_000,
  analytics: 5 * 60_000,
} as const

/** Resolve gcTime recomendado para um staleTime de catálogo/listagem. */
export function gcTimeForStaleTime(staleTime: number): number {
  if (staleTime >= CACHE.globalCatalog) return GC.globalCatalog
  if (staleTime >= CACHE.tenantStableCatalog) return GC.tenantStableCatalog
  if (staleTime >= CACHE.tenantCatalog) return GC.tenantCatalog
  if (staleTime === CACHE.analytics) return GC.analytics
  if (staleTime === CACHE.account) return GC.account
  if (staleTime === CACHE.tenantDetail) return GC.tenantDetail
  return GC.tenantList
}
