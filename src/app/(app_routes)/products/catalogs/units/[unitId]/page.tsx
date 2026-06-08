"use client"

import { useUnitDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("units")!

export default function UnitDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="unitId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultUnits}
      useDetailData={useUnitDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "Unidade", value: data.unit },
            { label: "Descrição", value: data.description },
            { label: "Compatível", value: data.compatible ?? "—" },
          ]}
        />
      )}
    />
  )
}
