"use client"

import { useProductAnpDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("anp")!

export default function AnpDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productsAnpId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultAnp}
      useDetailData={useProductAnpDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "ANP", value: data.anp },
            { label: "Descrição", value: data.description },
          ]}
        />
      )}
    />
  )
}
