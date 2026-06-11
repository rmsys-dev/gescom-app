"use client"

import { SaleDetailView } from "@/app/(app_routes)/sales/_components/sale-detail"
import { SaleDetailLoading } from "@/app/(app_routes)/sales/_components/sales-route-loading"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { HttpError } from "@/lib/api/http-error"
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

  const errMessage =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Não foi possível carregar o registro."

  const displayLabel = data
    ? `Pedido #${data.orderNumber}`
    : config.labels.singular

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-screen flex-col gap-0 p-0 sm:w-[70vw]! sm:max-w-[70vw]!"
      >
        <SheetHeader className="shrink-0 border-b px-6 py-4 text-left">
          <div className="flex flex-col items-start justify-between gap-4 pr-8">
            <div className="min-w-0">
              <SheetTitle className="text-lg">
                {displayLabel}
              </SheetTitle>
              <SheetDescription>
                Visualização detalhada da {config.labels.singular}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isPending && <SaleDetailLoading compact />}

          {error && !isPending && (
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="text-destructive text-base">
                  Erro ao carregar
                </CardTitle>
                <CardDescription>{errMessage}</CardDescription>
              </CardHeader>
            </Card>
          )}
          {data && !isPending && (
            <SaleDetailView sale={data} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
