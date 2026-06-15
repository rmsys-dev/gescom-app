"use client"

import { getProductResourceConfig } from "@/app/(app_routes)/products/_components/product-resource-config"
import { TenantResourceListView } from "@/app/(app_routes)/products/_components/tenant-resource-list-view"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ProductGroup } from "@/modules/products/products-catalogs.schema"
import { useProductGroupsQuery } from "@/modules/products/use-products"

const config = getProductResourceConfig("groups")!

export default function GroupsCatalogPage() {
  const perms = useOperatorPermissions()
  return (
    <TenantResourceListView<ProductGroup>
      title={config.title}
      description={config.description}
      permissionLabel={config.permissionLabel}
      canConsult={perms[config.permissionKey]}
      basePath={config.basePath}
      columns={[
        { header: "Descrição", cell: (item) => item.description },
        { header: "Margem", cell: (item) => item.profitMargin ?? "—" },
      ]}
      mobileTitle={(item) => item.description}
      useListData={useProductGroupsQuery}
    />
  )
}
