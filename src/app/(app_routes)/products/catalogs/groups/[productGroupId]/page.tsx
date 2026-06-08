"use client"

import { useProductGroupDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("groups")!

export default function GroupDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productGroupId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultProductGroups}
      useDetailData={useProductGroupDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "Descrição", value: data.description },
            { label: "Margem", value: data.profitMargin ?? "—" },
          ]}
        />
      )}
    />
  )
}
