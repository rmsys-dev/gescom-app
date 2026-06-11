import type { SaleSummary } from "@/modules/sales/sales.schema"

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
