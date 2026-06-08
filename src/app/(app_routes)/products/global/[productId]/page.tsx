"use client"

import { useProductDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import {
  DetailDl,
  ResourceDetailView,
} from "@/app/(app_routes)/products/_components/resource-detail-view"
import { ProductStatusBadge } from "@/app/(app_routes)/products/_components/product-status-badge"
import { useOperatorPermissions } from "@/lib/permissions"

export default function GlobalProductDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="productId"
      title="Produto global"
      permissionLabel="consultar_produtos"
      canConsult={perms.canConsultProducts}
      useDetailData={useProductDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "Descrição", value: data.description },
            { label: "Código de barras", value: data.barCode },
            {
              label: "Status",
              value: <ProductStatusBadge status={data.status} />,
            },
            {
              label: "Criado em",
              value: new Date(data.createdAt).toLocaleString("pt-BR"),
            },
          ]}
        />
      )}
    />
  )
}
