"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"

import {
  ProductDetailView,
  useProductPriceForEnterprise,
} from "@/app/(app_routes)/products/_components/product-detail-view"
import { AnimatedLoading } from "@/components/global/loading/animated-loading"
import { EntityDetailSheet } from "@/components/global/sheets/entity-detail-sheet"
import { Button } from "@/components/ui/button"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import {
  usePricesQuery,
  useProductEnterpriseQuery,
} from "@/modules/products/use-products"

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
  const displayLabel = product?.description ?? config.labels.singular

  return (
    <EntityDetailSheet
      open={open}
      onOpenChange={onOpenChange}
      title={displayLabel}
      description={`Visualização detalhada do ${config.labels.singular}`}
      isPending={isPending}
      error={error}
      errorTitle="Erro ao carregar"
      fallbackErrorMessage="Não foi possível carregar o registro."
      loading={<AnimatedLoading />}
      contentClassName="px-6 py-6"
      sheetClassName="w-screen sm:w-[70vw]! sm:max-w-[70vw]!"
      footer={
        product && !isPending ? (
          <div className="px-6 py-4">
            <Button variant="default" size="sm" asChild>
              <Link href={`${config.basePath}/${product.id}`}>
                <Pencil className="size-4" aria-hidden />
                Editar
              </Link>
            </Button>
          </div>
        ) : undefined
      }
    >
      {product ? (
        <ProductDetailView
          product={product}
          price={price}
          canConsultPrices={perms.canConsultPrices}
        />
      ) : null}
    </EntityDetailSheet>
  )
}
