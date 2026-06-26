import type {
  ProductBrand,
  ProductGroup,
  ProductSubgroup,
} from "@/modules/products/products-catalogs.schema"
import type {
  ProductEnterprise,
  ProductEnterpriseListItem,
} from "@/modules/products/products.schema"
import type { ProductApplication } from "@/modules/products/products-tenant-extras.schema"
import {
  getStockLocationCode,
  type StockBatch,
  type StockBatchBalance,
  type StockLocation,
  type StockSectorRental,
} from "@/modules/stock/stock.schema"

export type ProductEnterpriseListLookups = {
  groups?: ProductGroup[]
  subgroups?: ProductSubgroup[]
  brands?: ProductBrand[]
  applications?: ProductApplication[]
  locations?: StockLocation[]
  sectorRentals?: StockSectorRental[]
  batchBalances?: StockBatchBalance[]
  batches?: StockBatch[]
}

function buildDescriptionMap<T>(
  items: T[] | undefined,
  getId: (item: T) => string,
  getDescription: (item: T) => string
): Map<string, string> {
  return new Map(
    items?.map((item) => [getId(item), getDescription(item)]) ?? []
  )
}

function formatLocationLabel(location: StockLocation): string {
  const code = getStockLocationCode(location)
  const description = String(location.description ?? "").trim()

  if (code && description) return `${code} — ${description}`
  return description || code
}

function joinLabels(labels: Iterable<string>): string | null {
  const unique = [...new Set([...labels].filter(Boolean))]
  return unique.length > 0 ? unique.join(", ") : null
}

function addLocationLabel(
  map: Map<string, Set<string>>,
  productId: string,
  label: string | undefined
) {
  if (!label) return

  const current = map.get(productId) ?? new Set<string>()
  current.add(label)
  map.set(productId, current)
}

function resolveCatalogLabel(
  embedded: { description?: string | null } | null | undefined,
  id: string | null | undefined,
  map: Map<string, string>
): string | null {
  const embeddedDescription = embedded?.description?.trim()
  if (embeddedDescription) return embeddedDescription
  if (!id) return null
  return map.get(id) ?? null
}

export function collectMissingCatalogIds(
  items: ProductEnterprise[],
  lookups: ProductEnterpriseListLookups
): {
  groupIds: string[]
  subgroupIds: string[]
  brandIds: string[]
} {
  const groupMap = new Set(lookups.groups?.map((item) => item.id) ?? [])
  const subgroupMap = new Set(lookups.subgroups?.map((item) => item.id) ?? [])
  const brandMap = new Set(lookups.brands?.map((item) => item.id) ?? [])

  const groupIds = new Set<string>()
  const subgroupIds = new Set<string>()
  const brandIds = new Set<string>()

  for (const item of items) {
    const groupId = item.productGroupId ?? item.productGroup?.id
    const subgroupId = item.productSubgroupId ?? item.productSubgroup?.id
    const brandId = item.productBrandId ?? item.productBrand?.id

    if (groupId && !groupMap.has(groupId) && !item.productGroup?.description?.trim()) {
      groupIds.add(groupId)
    }
    if (
      subgroupId &&
      !subgroupMap.has(subgroupId) &&
      !item.productSubgroup?.description?.trim()
    ) {
      subgroupIds.add(subgroupId)
    }
    if (brandId && !brandMap.has(brandId) && !item.productBrand?.description?.trim()) {
      brandIds.add(brandId)
    }
  }

  return {
    groupIds: [...groupIds],
    subgroupIds: [...subgroupIds],
    brandIds: [...brandIds],
  }
}

export function enrichProductEnterpriseListItems(
  items: ProductEnterprise[],
  lookups: ProductEnterpriseListLookups
): ProductEnterpriseListItem[] {
  const groupMap = buildDescriptionMap(
    lookups.groups,
    (item) => item.id,
    (item) => item.description
  )
  const subgroupMap = buildDescriptionMap(
    lookups.subgroups,
    (item) => item.id,
    (item) => item.description
  )
  const brandMap = buildDescriptionMap(
    lookups.brands,
    (item) => item.id,
    (item) => item.description
  )
  const locationMap = new Map(
    lookups.locations?.map((location) => [
      location.id,
      formatLocationLabel(location),
    ]) ?? []
  )

  const applicationsByProduct = new Map<string, string[]>()
  for (const application of lookups.applications ?? []) {
    const current = applicationsByProduct.get(application.productsEnterprisesId) ?? []
    current.push(application.description)
    applicationsByProduct.set(application.productsEnterprisesId, current)
  }

  const locationsByProduct = new Map<string, Set<string>>()
  for (const rental of lookups.sectorRentals ?? []) {
    addLocationLabel(
      locationsByProduct,
      rental.productsEnterprisesId,
      locationMap.get(rental.stockLocationId)
    )
  }

  const batchToProduct = new Map(
    lookups.batches?.map((batch) => [batch.id, batch.productsEnterprisesId]) ?? []
  )

  for (const balance of lookups.batchBalances ?? []) {
    const productId = batchToProduct.get(balance.stockBatchId)
    if (!productId) continue

    addLocationLabel(
      locationsByProduct,
      productId,
      locationMap.get(balance.stockLocationId)
    )
  }

  return items.map((item) => ({
    ...item,
    group: resolveCatalogLabel(
      item.productGroup,
      item.productGroupId ?? item.productGroup?.id,
      groupMap
    ),
    subgroup: resolveCatalogLabel(
      item.productSubgroup,
      item.productSubgroupId ?? item.productSubgroup?.id,
      subgroupMap
    ),
    brand: resolveCatalogLabel(
      item.productBrand,
      item.productBrandId ?? item.productBrand?.id,
      brandMap
    ),
    application: joinLabels(applicationsByProduct.get(item.id) ?? []),
    stockLocation: joinLabels(locationsByProduct.get(item.id) ?? []),
  }))
}
