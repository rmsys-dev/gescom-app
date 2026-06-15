"use client"

import {
  useIcmsTaxationItemQuery,
  usePisCofinsSituationItemQuery,
  useProductAnpQuery,
  useProductBrandQuery,
  useProductCestQuery,
  useProductGroupQuery,
  useProductNbsQuery,
  useProductNcmQuery,
  useProductSubgroupQuery,
  useProductTaxationQuery,
  usePromotionalPriceQuery,
  useTypeProductQuery,
  useUnitQuery,
} from "@/modules/products/use-products"

type DetailQueryOpts = {
  id: string | undefined
  enabled: boolean
}

export function usePromotionalPriceDetailData({ id, enabled }: DetailQueryOpts) {
  return usePromotionalPriceQuery({ promotionalPriceId: id, enabled })
}

export function useProductTaxationDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductTaxationQuery({ productTaxationId: id, enabled })
}

export function useUnitDetailData({ id, enabled }: DetailQueryOpts) {
  return useUnitQuery({ unitId: id, enabled })
}

export function useTypeProductDetailData({ id, enabled }: DetailQueryOpts) {
  return useTypeProductQuery({ typeProductId: id, enabled })
}

export function useProductNcmDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductNcmQuery({ productsNcmId: id, enabled })
}

export function useProductCestDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductCestQuery({ productsCestId: id, enabled })
}

export function useProductAnpDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductAnpQuery({ productsAnpId: id, enabled })
}

export function useProductNbsDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductNbsQuery({ productsNbsId: id, enabled })
}

export function useIcmsTaxationDetailData({ id, enabled }: DetailQueryOpts) {
  return useIcmsTaxationItemQuery({ icmsTaxationId: id, enabled })
}

export function useProductGroupDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductGroupQuery({ productGroupId: id, enabled })
}

export function useProductSubgroupDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductSubgroupQuery({ productSubgroupId: id, enabled })
}

export function useProductBrandDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductBrandQuery({ productBrandId: id, enabled })
}

export function usePisCofinsSituationDetailData({ id, enabled }: DetailQueryOpts) {
  return usePisCofinsSituationItemQuery({ pisCofinsSituationId: id, enabled })
}
