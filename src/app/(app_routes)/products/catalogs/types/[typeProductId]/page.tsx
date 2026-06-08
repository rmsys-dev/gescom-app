"use client"

import { useTypeProductDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("types")!

export default function TypeProductDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="typeProductId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultTypesProduct}
      useDetailData={useTypeProductDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "Tipo", value: data.type },
            { label: "Descrição", value: data.description },
          ]}
        />
      )}
    />
  )
}
