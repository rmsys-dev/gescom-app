"use client"

import { useProductApplicationDetailData } from "@/app/(app_routes)/products/_components/resource-query-adapters"
import {
  DetailDl,
  ResourceDetailView,
} from "@/app/(app_routes)/products/_components/resource-detail-view"
import { useOperatorPermissions } from "@/lib/permissions"

export default function ProductApplicationDetailPage() {
  const perms = useOperatorPermissions()
  return (
    <ResourceDetailView
      paramKey="id"
      title="Aplicação"
      permissionLabel="consultar_aplicacoes_produto"
      canConsult={perms.canConsultProductApplications}
      requiresEnterprise
      useDetailData={useProductApplicationDetailData}
      renderContent={(data) => (
        <DetailDl
          rows={[
            { label: "Descrição", value: data.description },
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
