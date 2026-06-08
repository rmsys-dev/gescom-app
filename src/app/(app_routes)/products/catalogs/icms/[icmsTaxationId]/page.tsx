"use client"

import { useIcmsTaxationDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("icms")!

export default function IcmsDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="icmsTaxationId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultIcmsTaxation}
      useDetailData={useIcmsTaxationDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "ICMS", value: data.icms },
            { label: "Descrição", value: data.description },
            { label: "Alíquota", value: data.icmsRate ?? "—" },
            { label: "Simples", value: data.simplesIcmsRate ?? "—" },
          ]}
        />
      )}
    />
  )
}
