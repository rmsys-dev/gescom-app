"use client"

import { useProductCestDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("cest")!

export default function CestDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productsCestId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultCest}
      useDetailData={useProductCestDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "CEST", value: data.cest },
            { label: "Descrição", value: data.description },
            { label: "NCM ID", value: data.productsNcmId },
          ]}
        />
      )}
    />
  )
}
