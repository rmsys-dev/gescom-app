"use client"

import { CACHE } from "@/lib/react-query/cache-policy"
import { createCatalogListDetailHooks } from "@/lib/react-query/create-catalog-hooks"
import type {
  IcmsTaxation,
  ListProductNbsQuery,
  PisCofinsSituation,
  ProductAnp,
  ProductBrand,
  ProductCest,
  ProductGroup,
  ProductNbs,
  ProductNcm,
  ProductSubgroup,
  TypeProduct,
  Unit,
} from "@/modules/products/products-catalogs.schema"
import type { PaginationQuery } from "@/modules/products/products-query"
import { productsQueryKeys } from "@/modules/products/products-query-keys"
import type {
  ListProductsEnterprisesQuery,
  ListProductsQuery,
  Product,
  ProductEnterprise,
} from "@/modules/products/products.schema"
import type {
  Price,
  ProductApplication,
  ProductTaxation,
  PromotionalPrice,
} from "@/modules/products/products-tenant-extras.schema"
import {
  getIcmsTaxationService,
  getPriceService,
  getProductAnpService,
  getProductApplicationService,
  getProductBrandService,
  getProductCestService,
  getProductEnterpriseService,
  getProductGroupService,
  getProductNbsService,
  getProductNcmService,
  getProductService,
  getProductSubgroupService,
  getProductTaxationService,
  getPromotionalPriceService,
  getPisCofinsSituationService,
  getTypeProductService,
  getUnitService,
  listIcmsTaxationService,
  listPisCofinsSituationService,
  listPricesService,
  listProductApplicationsService,
  listProductBrandsService,
  listProductGroupsService,
  listProductSubgroupsService,
  listProductTaxationService,
  listProductsAnpService,
  listProductsCestService,
  listProductsEnterprisesService,
  listProductsNbsService,
  listProductsNcmService,
  listProductsService,
  listPromotionalPricesService,
  listTypesProductsService,
  listUnitsService,
} from "@/modules/products/products.service"

export { productsQueryKeys } from "@/modules/products/products-query-keys"

const productsCatalogHooks = createCatalogListDetailHooks<
  Product,
  ListProductsQuery
>({
  listKey: productsQueryKeys.products,
  detailKey: productsQueryKeys.product,
  listFn: listProductsService,
  getFn: getProductService,
  staleTime: CACHE.globalCatalog,
})

const productsEnterprisesCatalogHooks = createCatalogListDetailHooks<
  ProductEnterprise,
  ListProductsEnterprisesQuery
>({
  listKey: productsQueryKeys.enterprises,
  detailKey: productsQueryKeys.enterprise,
  listFn: listProductsEnterprisesService,
  getFn: getProductEnterpriseService,
  staleTime: CACHE.tenantDetail,
})

const pricesCatalogHooks = createCatalogListDetailHooks<Price, PaginationQuery>({
  listKey: productsQueryKeys.prices,
  detailKey: productsQueryKeys.price,
  listFn: listPricesService,
  getFn: getPriceService,
  staleTime: CACHE.tenantDetail,
})

const promotionalPricesCatalogHooks = createCatalogListDetailHooks<
  PromotionalPrice,
  PaginationQuery
>({
  listKey: productsQueryKeys.promotionalPrices,
  detailKey: productsQueryKeys.promotionalPrice,
  listFn: listPromotionalPricesService,
  getFn: getPromotionalPriceService,
  staleTime: CACHE.tenantDetail,
})

const taxationCatalogHooks = createCatalogListDetailHooks<
  ProductTaxation,
  PaginationQuery
>({
  listKey: productsQueryKeys.taxation,
  detailKey: productsQueryKeys.taxationItem,
  listFn: listProductTaxationService,
  getFn: getProductTaxationService,
  staleTime: CACHE.tenantDetail,
})

const applicationsCatalogHooks = createCatalogListDetailHooks<
  ProductApplication,
  PaginationQuery
>({
  listKey: productsQueryKeys.applications,
  detailKey: productsQueryKeys.application,
  listFn: listProductApplicationsService,
  getFn: getProductApplicationService,
  staleTime: CACHE.tenantDetail,
})

const unitsCatalogHooks = createCatalogListDetailHooks<Unit, PaginationQuery>({
  listKey: productsQueryKeys.units,
  detailKey: productsQueryKeys.unit,
  listFn: listUnitsService,
  getFn: getUnitService,
  staleTime: CACHE.globalCatalog,
})

const typesCatalogHooks = createCatalogListDetailHooks<
  TypeProduct,
  PaginationQuery
>({
  listKey: productsQueryKeys.types,
  detailKey: productsQueryKeys.type,
  listFn: listTypesProductsService,
  getFn: getTypeProductService,
  staleTime: CACHE.globalCatalog,
})

const ncmCatalogHooks = createCatalogListDetailHooks<
  ProductNcm,
  PaginationQuery
>({
  listKey: productsQueryKeys.ncm,
  detailKey: productsQueryKeys.ncmItem,
  listFn: listProductsNcmService,
  getFn: getProductNcmService,
  staleTime: CACHE.globalCatalog,
})

const cestCatalogHooks = createCatalogListDetailHooks<
  ProductCest,
  PaginationQuery
>({
  listKey: productsQueryKeys.cest,
  detailKey: productsQueryKeys.cestItem,
  listFn: listProductsCestService,
  getFn: getProductCestService,
  staleTime: CACHE.globalCatalog,
})

const anpCatalogHooks = createCatalogListDetailHooks<ProductAnp, PaginationQuery>(
  {
    listKey: productsQueryKeys.anp,
    detailKey: productsQueryKeys.anpItem,
    listFn: listProductsAnpService,
    getFn: getProductAnpService,
    staleTime: CACHE.globalCatalog,
  }
)

const nbsCatalogHooks = createCatalogListDetailHooks<
  ProductNbs,
  ListProductNbsQuery
>({
  listKey: productsQueryKeys.nbs,
  detailKey: productsQueryKeys.nbsItem,
  listFn: listProductsNbsService,
  getFn: getProductNbsService,
  staleTime: CACHE.globalCatalog,
})

const icmsCatalogHooks = createCatalogListDetailHooks<
  IcmsTaxation,
  PaginationQuery
>({
  listKey: productsQueryKeys.icms,
  detailKey: productsQueryKeys.icmsItem,
  listFn: listIcmsTaxationService,
  getFn: getIcmsTaxationService,
  staleTime: CACHE.globalCatalog,
})

const groupsCatalogHooks = createCatalogListDetailHooks<
  ProductGroup,
  PaginationQuery
>({
  listKey: productsQueryKeys.groups,
  detailKey: productsQueryKeys.group,
  listFn: listProductGroupsService,
  getFn: getProductGroupService,
  staleTime: CACHE.globalCatalog,
})

const subgroupsCatalogHooks = createCatalogListDetailHooks<
  ProductSubgroup,
  PaginationQuery
>({
  listKey: productsQueryKeys.subgroups,
  detailKey: productsQueryKeys.subgroup,
  listFn: listProductSubgroupsService,
  getFn: getProductSubgroupService,
  staleTime: CACHE.globalCatalog,
})

const brandsCatalogHooks = createCatalogListDetailHooks<
  ProductBrand,
  PaginationQuery
>({
  listKey: productsQueryKeys.brands,
  detailKey: productsQueryKeys.brand,
  listFn: listProductBrandsService,
  getFn: getProductBrandService,
  staleTime: CACHE.globalCatalog,
})

const pisCofinsCatalogHooks = createCatalogListDetailHooks<
  PisCofinsSituation,
  PaginationQuery
>({
  listKey: productsQueryKeys.pisCofins,
  detailKey: productsQueryKeys.pisCofinsItem,
  listFn: listPisCofinsSituationService,
  getFn: getPisCofinsSituationService,
  staleTime: CACHE.globalCatalog,
})

export const useProductsQuery = productsCatalogHooks.useListQuery
export function useProductQuery({
  productId,
  enabled = true,
}: {
  productId: string | undefined
  enabled?: boolean
}) {
  return productsCatalogHooks.useDetailQuery({ id: productId, enabled })
}

export const useProductsEnterprisesQuery =
  productsEnterprisesCatalogHooks.useListQuery
export function useProductEnterpriseQuery({
  productEnterpriseId,
  enabled = true,
}: {
  productEnterpriseId: string | undefined
  enabled?: boolean
}) {
  return productsEnterprisesCatalogHooks.useDetailQuery({
    id: productEnterpriseId,
    enabled,
  })
}

export const usePricesQuery = pricesCatalogHooks.useListQuery
export function usePriceQuery({
  priceId,
  enabled = true,
}: {
  priceId: string | undefined
  enabled?: boolean
}) {
  return pricesCatalogHooks.useDetailQuery({ id: priceId, enabled })
}

export const usePromotionalPricesQuery =
  promotionalPricesCatalogHooks.useListQuery
export function usePromotionalPriceQuery({
  promotionalPriceId,
  enabled = true,
}: {
  promotionalPriceId: string | undefined
  enabled?: boolean
}) {
  return promotionalPricesCatalogHooks.useDetailQuery({
    id: promotionalPriceId,
    enabled,
  })
}

export const useProductTaxationListQuery = taxationCatalogHooks.useListQuery
export function useProductTaxationQuery({
  productTaxationId,
  enabled = true,
}: {
  productTaxationId: string | undefined
  enabled?: boolean
}) {
  return taxationCatalogHooks.useDetailQuery({
    id: productTaxationId,
    enabled,
  })
}

export const useProductApplicationsQuery = applicationsCatalogHooks.useListQuery
export function useProductApplicationQuery({
  applicationId,
  enabled = true,
}: {
  applicationId: string | undefined
  enabled?: boolean
}) {
  return applicationsCatalogHooks.useDetailQuery({ id: applicationId, enabled })
}

export const useUnitsQuery = unitsCatalogHooks.useListQuery
export function useUnitQuery({
  unitId,
  enabled = true,
}: {
  unitId: string | undefined
  enabled?: boolean
}) {
  return unitsCatalogHooks.useDetailQuery({ id: unitId, enabled })
}

export const useTypesProductsQuery = typesCatalogHooks.useListQuery
export function useTypeProductQuery({
  typeProductId,
  enabled = true,
}: {
  typeProductId: string | undefined
  enabled?: boolean
}) {
  return typesCatalogHooks.useDetailQuery({ id: typeProductId, enabled })
}

export const useProductsNcmQuery = ncmCatalogHooks.useListQuery
export function useProductNcmQuery({
  productsNcmId,
  enabled = true,
}: {
  productsNcmId: string | undefined
  enabled?: boolean
}) {
  return ncmCatalogHooks.useDetailQuery({ id: productsNcmId, enabled })
}

export const useProductsCestQuery = cestCatalogHooks.useListQuery
export function useProductCestQuery({
  productsCestId,
  enabled = true,
}: {
  productsCestId: string | undefined
  enabled?: boolean
}) {
  return cestCatalogHooks.useDetailQuery({ id: productsCestId, enabled })
}

export const useProductsAnpQuery = anpCatalogHooks.useListQuery
export function useProductAnpQuery({
  productsAnpId,
  enabled = true,
}: {
  productsAnpId: string | undefined
  enabled?: boolean
}) {
  return anpCatalogHooks.useDetailQuery({ id: productsAnpId, enabled })
}

export const useProductsNbsQuery = nbsCatalogHooks.useListQuery
export function useProductNbsQuery({
  productsNbsId,
  enabled = true,
}: {
  productsNbsId: string | undefined
  enabled?: boolean
}) {
  return nbsCatalogHooks.useDetailQuery({ id: productsNbsId, enabled })
}

export const useIcmsTaxationQuery = icmsCatalogHooks.useListQuery
export function useIcmsTaxationItemQuery({
  icmsTaxationId,
  enabled = true,
}: {
  icmsTaxationId: string | undefined
  enabled?: boolean
}) {
  return icmsCatalogHooks.useDetailQuery({ id: icmsTaxationId, enabled })
}

export const useProductGroupsQuery = groupsCatalogHooks.useListQuery
export function useProductGroupQuery({
  productGroupId,
  enabled = true,
}: {
  productGroupId: string | undefined
  enabled?: boolean
}) {
  return groupsCatalogHooks.useDetailQuery({ id: productGroupId, enabled })
}

export const useProductSubgroupsQuery = subgroupsCatalogHooks.useListQuery
export function useProductSubgroupQuery({
  productSubgroupId,
  enabled = true,
}: {
  productSubgroupId: string | undefined
  enabled?: boolean
}) {
  return subgroupsCatalogHooks.useDetailQuery({ id: productSubgroupId, enabled })
}

export const useProductBrandsQuery = brandsCatalogHooks.useListQuery
export function useProductBrandQuery({
  productBrandId,
  enabled = true,
}: {
  productBrandId: string | undefined
  enabled?: boolean
}) {
  return brandsCatalogHooks.useDetailQuery({ id: productBrandId, enabled })
}

export const usePisCofinsSituationQuery = pisCofinsCatalogHooks.useListQuery
export function usePisCofinsSituationItemQuery({
  pisCofinsSituationId,
  enabled = true,
}: {
  pisCofinsSituationId: string | undefined
  enabled?: boolean
}) {
  return pisCofinsCatalogHooks.useDetailQuery({
    id: pisCofinsSituationId,
    enabled,
  })
}
