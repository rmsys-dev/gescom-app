"use client"

import { PromotionalPriceDetailView } from "@/app/(app_routes)/products/_components/promotional-price-detail-view"
import { ProductDetailContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
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
import { formatCurrency } from "@/lib/formatters"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import { usePromotionalPriceQuery } from "@/modules/products/use-products"

type PromotionalPriceDetailDialogProps = {
  promotionalPriceId: string
  config: ProductsListRouteConfig
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PromotionalPriceDetailDialog({
  promotionalPriceId,
  config,
  open,
  onOpenChange,
}: PromotionalPriceDetailDialogProps) {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const { data, error, isPending } = usePromotionalPriceQuery({
    promotionalPriceId,
    enabled:
      open && ready && perms.canConsultPromotionalPrices && Boolean(promotionalPriceId),
  })

  const errMessage =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Não foi possível carregar o registro."

  const displayLabel =
    data?.description ?? (data?.price ? formatCurrency(data.price) : config.labels.singular)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-screen flex-col gap-0 p-0 sm:w-[70vw]! sm:max-w-[70vw]!"
      >
        <SheetHeader className="shrink-0 border-b px-6 py-4 text-left">
          <div className="flex flex-col items-start justify-between gap-4 pr-8">
            <div className="min-w-0">
              <SheetTitle className="text-lg">{displayLabel}</SheetTitle>
              <SheetDescription>
                Visualização detalhada do {config.labels.singular}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isPending && <ProductDetailContentLoading compact />}

          {error && !isPending && (
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="text-base text-destructive">
                  Erro ao carregar
                </CardTitle>
                <CardDescription>{errMessage}</CardDescription>
              </CardHeader>
            </Card>
          )}

          {data && !isPending && <PromotionalPriceDetailView data={data} />}
        </div>
      </SheetContent>
    </Sheet>
  )
}
