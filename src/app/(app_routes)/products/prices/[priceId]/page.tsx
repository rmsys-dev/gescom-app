"use client"

import { usePriceDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import {
  DetailDl,
  ResourceDetailView,
} from "@/app/(app_routes)/products/_components/resource-detail-view"
import { useOperatorPermissions } from "@/lib/permissions"

export default function PriceDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="priceId"
      title="Detalhe do preço"
      permissionLabel="consultar_precos"
      canConsult={perms.canConsultPrices}
      requiresEnterprise
      useDetailData={usePriceDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "Preço", value: data.price },
            { label: "Custo", value: data.priceCost ?? "—" },
            { label: "Custo médio", value: data.averageCost ?? "—" },
            {
              label: "Produto-empresa",
              value: (
                <span className="font-mono text-xs">{data.productsEnterprisesId}</span>
              ),
            },
          ]}
        />
      )}
    />
  )
}
