"use client"

import { getProductResourceConfig } from "@/app/(app_routes)/products/_components/product-resource-config"
import { TenantResourceListView } from "@/app/(app_routes)/products/_components/tenant-resource-list-view"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ProductBrand } from "@/modules/products/products-catalogs.schema"
import { useProductBrandsQuery } from "@/modules/products/use-products"

const config = getProductResourceConfig("brands")!

export default function BrandsCatalogPage() {
  const perms = useOperatorPermissions()
  return (
    <TenantResourceListView<ProductBrand>
      title={config.title}
      description={config.description}
      permissionLabel={config.permissionLabel}
      canConsult={perms[config.permissionKey]}
      layout="grid"
      cardTitle={(item) => item.description}
      useListData={useProductBrandsQuery}
    />
  )
}
