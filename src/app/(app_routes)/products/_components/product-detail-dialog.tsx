"use client"

import {
  ProductDetailView,
  useProductPriceForEnterprise,
} from "@/app/(app_routes)/products/_components/product-detail-view"
import { ProductDetailContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import { Button } from "@/components/ui/button"
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { HttpError } from "@/lib/api/http-error"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import {
  usePricesQuery,
  useProductEnterpriseQuery,
} from "@/modules/products/use-products"
import { Pencil } from "lucide-react"
import Link from "next/link"

type ProductDetailDialogProps = {
  productEnterpriseId: string
  config: ProductsListRouteConfig
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailDialog({
  productEnterpriseId,
  config,
  open,
  onOpenChange,
}: ProductDetailDialogProps) {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const { data: product, error, isPending } = useProductEnterpriseQuery({
    productEnterpriseId,
    enabled: open && ready && perms.canConsultProducts && Boolean(productEnterpriseId),
  })

  const { data: pricesData } = usePricesQuery({
    enabled: open && ready && perms.canConsultPrices && Boolean(product?.id),
  })

  const price = useProductPriceForEnterprise(pricesData, product?.id)

  const errMessage =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Não foi possível carregar o registro."

  const displayLabel = product?.description ?? config.labels.singular

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

          {product && !isPending && (
            <ProductDetailView
              product={product}
              price={price}
              canConsultPrices={perms.canConsultPrices}
            />
          )}
        </div>

        {product && !isPending && (
          <SheetFooter className="shrink-0 border-t px-6 py-4">
            <Button variant="default" size="sm" asChild>
              <Link href={`${config.basePath}/${product.id}`}>
                <Pencil className="size-4" aria-hidden />
                Editar
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
