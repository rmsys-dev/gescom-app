"use client"

import { useProductNbsDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("nbs")!

export default function NbsDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productsNbsId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultNbs}
      useDetailData={useProductNbsDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "NBS", value: data.nbs },
            { label: "Descrição", value: data.description },
            { label: "LC 116", value: data.lc116Item ?? "—" },
            { label: "Class. trib.", value: data.cClassTribName ?? data.cClassTrib ?? "—" },
          ]}
        />
      )}
    />
  )
}
