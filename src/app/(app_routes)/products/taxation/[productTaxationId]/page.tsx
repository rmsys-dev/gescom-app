"use client"

import { useProductTaxationDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import {
  DetailDl,
  ResourceDetailView,
} from "@/app/(app_routes)/products/_components/resource-detail-view"
import { useOperatorPermissions } from "@/lib/permissions"

export default function ProductTaxationDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productTaxationId"
      title="Tributação"
      permissionLabel="consultar_tributacao_produto"
      canConsult={perms.canConsultProductTaxation}
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
