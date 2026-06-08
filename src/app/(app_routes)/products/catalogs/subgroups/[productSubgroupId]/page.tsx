"use client"

import { useProductSubgroupDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("subgroups")!

export default function SubgroupDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productSubgroupId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultProductSubgroups}
      useDetailData={useProductSubgroupDetailData}
      renderContent={(data) => (
        <DetailDl rows={[{ label: "Descrição", value: data.description }]} />
      )}
    />
  )
}
