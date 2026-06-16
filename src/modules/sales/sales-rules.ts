import type { SaleSummary } from "@/modules/sales/sales.schema"
import type { ListSalesQuery } from "@/modules/sales/sales.schema"

export const SALES_UNIFIED_NAME_SEARCH_FETCH_LIMIT = 100

export type ParsedSalesSearch =
  | { kind: "empty" }
  | { kind: "orderNumber"; orderNumber: string }
  | { kind: "name"; name: string }

/** Detecta pedido (numérico) ou nome de vendedor/cliente a partir de um único termo. */
export function parseSalesSearchTerm(raw: string): ParsedSalesSearch {
  const trimmed = raw.trim()
  if (!trimmed) return { kind: "empty" }

  const orderDigits = trimmed.replace(/^#/, "").trim()
  if (/^\d+$/.test(orderDigits)) {
    return { kind: "orderNumber", orderNumber: orderDigits }
  }

  return { kind: "name", name: trimmed }
}

export function isUnifiedNameSearchQuery(query: ListSalesQuery): boolean {
  return Boolean(
    query.seller &&
      query.client &&
      query.seller.trim() === query.client.trim()
  )
}

export function mergeSalesById(items: SaleSummary[]): SaleSummary[] {
  const seen = new Set<string>()
  const merged: SaleSummary[] = []
  for (const item of items) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    merged.push(item)
  }
  return merged
}

export function filterSalesBySearchTerm(
  items: SaleSummary[],
  term: string
): SaleSummary[] {
  const normalized = term.trim().toLowerCase()
  if (!normalized) return items

  return items.filter((item) => {
    const seller = item.sellerLegalName.toLowerCase()
    const client = (item.memberName ?? "").toLowerCase()
    const order = String(item.orderNumber).includes(normalized)
    return seller.includes(normalized) || client.includes(normalized) || order
  })
}
