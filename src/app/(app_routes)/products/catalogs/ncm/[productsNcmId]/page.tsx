"use client"

import { useProductNcmDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("ncm")!

export default function NcmDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productsNcmId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultNcm}
      useDetailData={useProductNcmDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "NCM", value: data.ncm },
            { label: "Descrição", value: data.description },
          ]}
        />
      )}
    />
  )
}
