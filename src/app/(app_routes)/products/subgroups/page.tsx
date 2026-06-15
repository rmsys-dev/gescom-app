"use client"

import { getProductResourceConfig } from "@/app/(app_routes)/products/_components/product-resource-config"
import { TenantResourceListView } from "@/app/(app_routes)/products/_components/tenant-resource-list-view"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ProductSubgroup } from "@/modules/products/products-catalogs.schema"
import { useProductSubgroupsQuery } from "@/modules/products/use-products"

const config = getProductResourceConfig("subgroups")!

export default function SubgroupsCatalogPage() {
  const perms = useOperatorPermissions()
  return (
    <TenantResourceListView<ProductSubgroup>
      title={config.title}
      description={config.description}
      permissionLabel={config.permissionLabel}
      canConsult={perms[config.permissionKey]}
      basePath={config.basePath}
      columns={[{ header: "Descrição", cell: (item) => item.description }]}
      mobileTitle={(item) => item.description}
      useListData={useProductSubgroupsQuery}
    />
  )
}
