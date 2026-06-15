"use client"

import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import { useProductTaxationDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import {
  DetailDl,
  ResourceDetailView,
} from "@/app/(app_routes)/products/_components/resource-detail-view"
import { useOperatorPermissions } from "@/lib/permissions"

const config = getCatalogConfig("taxation")!

export default function ProductTaxationDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productTaxationId"
      title={config.title}
      permissionLabel={config.permissionLabel}
      canConsult={perms[config.permissionKey]}
      requiresEnterprise
      useDetailData={useProductTaxationDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "PIS entrada", value: data.cst_pis_entrada ?? "—" },
            { label: "PIS saída", value: data.cst_pis_saida ?? "—" },
            { label: "COFINS entrada", value: data.cst_cofins_entrada ?? "—" },
            { label: "COFINS saída", value: data.cst_cofins_saida ?? "—" },
            { label: "ICMS ID", value: data.icmsTaxationId ?? "—" },
          ]}
        />
      )}
    />
  )
}
