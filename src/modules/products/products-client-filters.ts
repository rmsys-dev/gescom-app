import type { ProductsDateFilters } from "@/app/(app_routes)/products/_components/products-constants"
import type { ProductEnterprise, ProductStatus } from "@/modules/products/products.schema"

export type ProductsClientFilterCriteria = {
  code?: string
  description?: string
  barCode?: string
  status?: ProductStatus
  controlsBatch?: boolean
  manufacturer?: string
  dateFilters: ProductsDateFilters
}

function toDateOnly(value: string): string {
  return value.slice(0, 10)
}

function matchesText(value: string | null | undefined, term: string): boolean {
  if (!term) return true
  const normalized = (value ?? "").toLowerCase()
  return normalized.includes(term.toLowerCase())
}

function matchesCode(code: number | null, term: string): boolean {
  if (!term) return true
  if (code === null) return false
  return String(code).includes(term.trim())
}

function matchesDateRange(
  createdAt: string,
  dateFrom?: string,
  dateTo?: string
): boolean {
  const itemDate = toDateOnly(createdAt)
  if (dateFrom && itemDate < dateFrom) return false
  if (dateTo && itemDate > dateTo) return false
  return true
}

export function filterProductEnterprises(
  items: ProductEnterprise[],
  criteria: ProductsClientFilterCriteria
): ProductEnterprise[] {
  const code = criteria.code?.trim() ?? ""
  const description = criteria.description?.trim() ?? ""
  const barCode = criteria.barCode?.trim() ?? ""
  const manufacturer = criteria.manufacturer?.trim() ?? ""
  const dateFrom = criteria.dateFilters.dateFrom?.trim() || undefined
  const dateTo = criteria.dateFilters.dateTo?.trim() || undefined

  const hasClientCriteria =
    code.length > 0 ||
    description.length > 0 ||
    barCode.length > 0 ||
    manufacturer.length > 0 ||
    criteria.controlsBatch !== undefined ||
    Boolean(criteria.status) ||
    Boolean(dateFrom) ||
    Boolean(dateTo)

  if (!hasClientCriteria) return items

  return items.filter((item) => {
    if (criteria.status && item.status !== criteria.status) return false
    if (
      criteria.controlsBatch !== undefined &&
      item.controlsBatch !== criteria.controlsBatch
    ) {
      return false
    }
    if (!matchesCode(item.code, code)) return false
    if (!matchesText(item.description, description)) return false
    if (!matchesText(item.barCode, barCode)) return false
    if (!matchesText(item.manufacturer, manufacturer)) return false
    if (!matchesDateRange(item.createdAt, dateFrom, dateTo)) return false
    return true
  })
}

export function hasActiveProductsClientFilters(
  criteria: ProductsClientFilterCriteria
): boolean {
  return (
    Boolean(criteria.code?.trim()) ||
    Boolean(criteria.description?.trim()) ||
    Boolean(criteria.barCode?.trim()) ||
    Boolean(criteria.manufacturer?.trim()) ||
    criteria.controlsBatch !== undefined ||
    Boolean(criteria.status) ||
    Boolean(criteria.dateFilters.dateFrom?.trim()) ||
    Boolean(criteria.dateFilters.dateTo?.trim())
  )
}
