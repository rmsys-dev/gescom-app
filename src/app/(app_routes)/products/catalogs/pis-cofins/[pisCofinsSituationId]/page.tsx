"use client"

import { usePisCofinsSituationDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("pis-cofins")!

export default function PisCofinsDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="pisCofinsSituationId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultPisCofins}
      useDetailData={usePisCofinsSituationDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "CST", value: data.cst },
            { label: "Descrição", value: data.description },
            { label: "Tipo", value: data.type },
            { label: "PIS", value: data.pisRate ?? "—" },
            { label: "COFINS", value: data.cofinsRate ?? "—" },
          ]}
        />
      )}
    />
  )
}
