"use client"

import { useMemo } from "react"

import {
  ProductEnterpriseDetailsCard,
  ProductPriceSection,
} from "@/app/(app_routes)/products/_components/product-enterprise-field"
import type { ProductEnterprise } from "@/modules/products/products.schema"
import type { Price } from "@/modules/products/products-tenant-extras.schema"

type ProductDetailViewProps = {
  product: ProductEnterprise
  price?: Price
  canConsultPrices?: boolean
}

export function ProductDetailView({
  product,
  price,
  canConsultPrices = false,
}: ProductDetailViewProps) {
  return (
    <div className="space-y-6">
      <ProductEnterpriseDetailsCard product={product} />
      <ProductPriceSection price={price} canConsult={canConsultPrices} />
    </div>
  )
}

export function useProductPriceForEnterprise(
  prices: { items: Price[] } | undefined,
  productEnterpriseId: string | undefined
) {
  return useMemo(
    () =>
      prices?.items.find((p) => p.productsEnterprisesId === productEnterpriseId),
    [prices, productEnterpriseId]
  )
}
