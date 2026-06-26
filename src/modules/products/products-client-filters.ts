import type { ProductsDateFilters } from "@/app/(app_routes)/products/_components/products-constants"
import type { ProductEnterprise, ProductEnterpriseStatus } from "@/modules/products/products.schema"

export type ProductsClientFilterCriteria = {
  status?: ProductEnterpriseStatus
  controlsBatch?: boolean
  locacao?: string
  dateFilters: ProductsDateFilters
}

function toDateOnly(value: string): string {
  return value.slice(0, 10)
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
  const dateFrom = criteria.dateFilters.dateFrom?.trim() || undefined
  const dateTo = criteria.dateFilters.dateTo?.trim() || undefined

  const hasClientCriteria =
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
    if (!matchesDateRange(item.createdAt, dateFrom, dateTo)) return false
    return true
  })
}

export function hasActiveProductsClientFilters(
  criteria: ProductsClientFilterCriteria
): boolean {
  return (
    criteria.controlsBatch !== undefined ||
    Boolean(criteria.status) ||
    Boolean(criteria.locacao?.trim()) ||
    Boolean(criteria.dateFilters.dateFrom?.trim()) ||
    Boolean(criteria.dateFilters.dateTo?.trim())
  )
}
