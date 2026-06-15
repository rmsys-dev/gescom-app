"use client"

import { getProductResourceConfig } from "@/app/(app_routes)/products/_components/product-resource-config"
import { useProductBrandDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import { DetailDl, ResourceDetailView } from "@/app/(app_routes)/products/_components/resource-detail-view"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getProductResourceConfig("brands")!

export default function BrandDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productBrandId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms[config.permissionKey]}
      useDetailData={useProductBrandDetailData}
      renderContent={(data) => (
        <DetailDl rows={[{ label: "Descrição", value: data.description }]} />
      )}
    />
  )
}
