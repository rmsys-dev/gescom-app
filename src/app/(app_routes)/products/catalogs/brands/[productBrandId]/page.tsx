"use client"

import { useProductBrandDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("brands")!

export default function BrandDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productBrandId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms.canConsultProductBrands}
      useDetailData={useProductBrandDetailData}
      renderContent={(data) => (
        <DetailDl rows={[{ label: "Descrição", value: data.description }]} />
      )}
    />
  )
}
