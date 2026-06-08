"use client"

import { usePromotionalPriceDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import {
  DetailDl,
  ResourceDetailView,
} from "@/app/(app_routes)/products/_components/resource-detail-view"
import { useOperatorPermissions } from "@/lib/permissions"

export default function PromotionalPriceDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="promotionalPriceId"
      title="Preço promocional"
      permissionLabel="consultar_precos_promocionais"
      canConsult={perms.canConsultPromotionalPrices}
      requiresEnterprise
      useDetailData={usePromotionalPriceDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "Preço", value: data.price },
            { label: "Descrição", value: data.description ?? "—" },
            {
              label: "Início",
              value: new Date(data.startDate).toLocaleString("pt-BR"),
            },
            {
              label: "Fim",
              value: new Date(data.endDate).toLocaleString("pt-BR"),
            },
          ]}
        />
      )}
    />
  )
}
