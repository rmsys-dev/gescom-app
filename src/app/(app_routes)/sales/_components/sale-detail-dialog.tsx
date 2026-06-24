"use client"

import { SaleDetailView } from "@/app/(app_routes)/sales/_components/sale-detail"
import { SaleDetailLoading } from "@/app/(app_routes)/sales/_components/sales-route-loading"
import { EntityDetailSheet } from "@/components/global/sheets/entity-detail-sheet"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import type { SalesListRouteConfig } from "@/modules/sales/sales-route-config"
import { useSaleQuery } from "@/modules/sales/use-sales"

type SaleDetailDialogProps = {
  saleId: string
  config: SalesListRouteConfig
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaleDetailDialog({
  saleId,
  config,
  open,
  onOpenChange,
}: SaleDetailDialogProps) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const { data, error, isPending } = useSaleQuery({
    enterpriseId,
    saleId,
    enabled: open && ready && perms.canConsultSales && Boolean(saleId),
  })

  const displayLabel = data
    ? `Pedido #${data.orderNumber}`
    : config.labels.singular

  return (
    <EntityDetailSheet
      open={open}
      onOpenChange={onOpenChange}
      title={displayLabel}
      description={`Visualização detalhada da ${config.labels.singular}`}
      isPending={isPending}
      error={error}
      errorTitle="Erro ao carregar"
      fallbackErrorMessage="Não foi possível carregar o registro."
      loading={<SaleDetailLoading compact />}
      contentClassName="px-6 py-6"
      sheetClassName="w-screen sm:w-[70vw]! sm:max-w-[70vw]!"
    >
      {data ? <SaleDetailView sale={data} /> : null}
    </EntityDetailSheet>
  )
}
