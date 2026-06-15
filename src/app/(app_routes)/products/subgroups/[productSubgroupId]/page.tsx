"use client"

import { getProductResourceConfig } from "@/app/(app_routes)/products/_components/product-resource-config"
import { useProductSubgroupDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getProductResourceConfig("subgroups")!

export default function SubgroupDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productSubgroupId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms[config.permissionKey]}
      useDetailData={useProductSubgroupDetailData}
      renderContent={(data) => (
        <DetailDl rows={[{ label: "Descrição", value: data.description }]} />
      )}
    />
  )
}
