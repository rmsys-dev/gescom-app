export const ROUTE_LABELS: Record<string, string> = {
  "/home": "Home",
  "/profile": "Perfil",
  "/enterprise": "Empresa",
  "/members": "Membros	",
  "/members/new": "Novo membro",
  "/members/invite": "Convidar membro",
  "/notifications": "Notificações",
  "/support": "Suporte",
  "/clients": "Clientes",
  "/clients/new": "Novo cliente",
  "/clients/link": "Vincular cliente",
  "/products": "Produtos",
  "/products/global": "Produtos globais",
  "/products/catalogs": "Catálogos",
  "/products/prices": "Preços",
  "/products/promotional-prices": "Preços promocionais",
  "/products/taxation": "Tributação",
  "/products/applications": "Aplicações",
  "/products/catalogs/units": "Unidades",
  "/products/catalogs/types": "Tipos",
  "/products/catalogs/ncm": "NCM",
  "/products/catalogs/cest": "CEST",
  "/products/catalogs/anp": "ANP",
  "/products/catalogs/nbs": "NBS",
  "/products/catalogs/icms": "ICMS",
  "/products/catalogs/groups": "Grupos",
  "/products/catalogs/subgroups": "Subgrupos",
  "/products/catalogs/brands": "Marcas",
  "/products/catalogs/pis-cofins": "PIS/COFINS",
  "/sales": "Vendas",
  "/sales/dashboard": "Dashboard de Vendas",
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

function getNestedRouteLabel(segments: string[]): string {
  for (let i = segments.length; i >= 2; i--) {
    const path = `/${segments.slice(0, i).join("/")}`
    const label = ROUTE_LABELS[path]
    if (label) return label
  }

  const last = segments.at(-1)
  if (!last) return "Gescom"

  if (isDynamicSegment(last)) {
    const section = segments[0]
    return NESTED_DYNAMIC_LABELS[section] ?? "Detalhes"
  }

  return last.charAt(0).toUpperCase() + last.slice(1)
}

export function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length <= 1) {
    return [{ label: getRouteLabel(pathname) }]
  }

  const parentPath = `/${segments[0]}`
  const parentLabel = ROUTE_LABELS[parentPath]
  if (!parentLabel) {
    return [{ label: getRouteLabel(pathname) }]
  }

  return [
    { href: parentPath, label: parentLabel },
    { label: getNestedRouteLabel(segments) },
  ]
}
