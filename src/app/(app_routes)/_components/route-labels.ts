export const ROUTE_LABELS: Record<string, string> = {
  "/home": "Home",
  "/profile": "Perfil",
  "/enterprise": "Empresa",
  "/members": "Membros",
  "/members/new": "Novo membro",
  "/members/invite": "Convidar membro",
  "/notifications": "Notificações",
  "/support": "Suporte",
  "/clients": "Clientes",
  "/clients/new": "Novo cliente",
  "/clients/link": "Vincular cliente",
  "/products": "Produtos",
  "/products/catalogs": "Catálogos",
  "/products/promotional-prices": "Preços promocionais",
  "/products/catalogs/units": "Unidades",
  "/products/catalogs/types": "Tipos",
  "/products/catalogs/ncm": "NCM",
  "/products/catalogs/cest": "CEST",
  "/products/catalogs/anp": "ANP",
  "/products/catalogs/nbs": "NBS",
  "/products/catalogs/icms": "ICMS",
  "/products/catalogs/pis-cofins": "PIS/COFINS",
  "/products/catalogs/taxation": "Tributação",
  "/products/groups": "Grupos",
  "/products/subgroups": "Subgrupos",
  "/products/brands": "Marcas",
  "/sales": "Vendas",
  "/sales/budgets": "Orçamentos",
  "/sales/dashboard": "Dashboard de Vendas",
  "/stock": "Estoque",
  "/stock/sectors": "Setores de estoque",
  "/stock/locations": "Locações de estoque",
  "/stock/batches": "Lotes de estoque",
  "/stock/sector-rentals": "Saldos de estoque",
  "/stock/batch-balances": "Saldos por lote",
  "/stock/min-max": "Estoque mín/máx",
  "/stock/movements": "Movimentos de estoque",
}

export function isSidebarPathActive(pathname: string, href: string): boolean {
  if (!href || href === "#") return false
  if (pathname === href) return true
  return pathname.startsWith(`${href}/`)
}

export function getRouteLabel(pathname: string): string {
  const exact = ROUTE_LABELS[pathname]
  if (exact) return exact

  const segments = pathname.split("/").filter(Boolean)
  const base = segments.length > 0 ? `/${segments[0]}` : ""
  const baseLabel = base ? ROUTE_LABELS[base] : undefined
  if (baseLabel) return baseLabel

  const last = segments.at(-1)
  if (!last) return "Gescom"

  return last.charAt(0).toUpperCase() + last.slice(1)
}

export type BreadcrumbItem = {
  href?: string
  label: string
}

const NESTED_DYNAMIC_LABELS: Record<string, string> = {
  clients: "Cliente",
  members: "Membro",
  products: "Produto",
  sales: "Venda",
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isDynamicSegment(segment: string): boolean {
  return UUID_RE.test(segment) || /^\d+$/.test(segment)
}

export function isNestedOrDynamicRoute(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean)
  return segments.length > 1
}

function getDynamicSegmentLabel(segments: string[]): string {
  const section = segments[0]
  return NESTED_DYNAMIC_LABELS[section] ?? "Detalhes"
}

function getSegmentLabel(segments: string[], index: number): string | null {
  const path = `/${segments.slice(0, index + 1).join("/")}`
  const known = ROUTE_LABELS[path]
  if (known) return known

  const segment = segments[index]
  const isLast = index === segments.length - 1

  if (!isLast) return null

  if (isDynamicSegment(segment)) {
    return getDynamicSegmentLabel(segments)
  }

  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length <= 1) {
    return []
  }

  const items: BreadcrumbItem[] = []

  for (let i = 0; i < segments.length; i++) {
    const label = getSegmentLabel(segments, i)
    if (!label) continue

    const isLast = i === segments.length - 1
    const path = `/${segments.slice(0, i + 1).join("/")}`

    items.push({
      href: isLast ? undefined : path,
      label,
    })
  }

  return items
}
