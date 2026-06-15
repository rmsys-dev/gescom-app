"use client"

import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { TenantResourceListView } from "@/app/(app_routes)/products/_components/tenant-resource-list-view"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ProductTaxation } from "@/modules/products/products-tenant-extras.schema"
import { useProductTaxationListQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("taxation")!

export default function ProductTaxationPage() {
  const perms = useOperatorPermissions()
  return (
    <TenantResourceListView<ProductTaxation>
      title={config.title}
      description={config.description}
      permissionLabel={config.permissionLabel}
      canConsult={perms[config.permissionKey]}
      basePath={config.basePath}
      columns={[
        {
          header: "PIS entrada",
          cell: (item) => item.cst_pis_entrada ?? "—",
        },
        {
          header: "PIS saída",
          cell: (item) => item.cst_pis_saida ?? "—",
        },
      ]}
      mobileTitle={() => "Tributação"}
      useListData={useProductTaxationListQuery}
    />
  )
}
