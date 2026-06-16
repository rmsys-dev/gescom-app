"use client"

import { useMemo } from "react"

import { ProductStatusBadge } from "@/app/(app_routes)/products/_components/product-status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ProductEnterprise } from "@/modules/products/products.schema"
import type { Price } from "@/modules/products/products-tenant-extras.schema"

type ProductDetailViewProps = {
  product: ProductEnterprise
  price?: Price
}

export function ProductDetailView({ product, price }: ProductDetailViewProps) {
  const perms = useOperatorPermissions()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dados do produto</CardTitle>
          <CardDescription>Informação do vínculo produto-empresa</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Código</dt>
              <dd className="font-mono text-sm">{product.code ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Status</dt>
              <dd className="mt-0.5">
                <ProductStatusBadge status={product.status} />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-muted-foreground">
                Descrição
              </dt>
              <dd className="text-sm">{product.description}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Código de barras
              </dt>
              <dd className="font-mono text-sm">{product.barCode}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Controla lote
              </dt>
              <dd className="text-sm">{product.controlsBatch ? "Sim" : "Não"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {perms.canConsultPrices && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preço</CardTitle>
          </CardHeader>
          <CardContent>
            {price ? (
              <dl className="grid gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Preço de venda</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatCurrency(price.price)}
                  </dd>
                </div>
                {price.priceCost && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Custo</dt>
                    <dd className="tabular-nums">{formatCurrency(price.priceCost)}</dd>
                  </div>
                )}
                {price.averageCost && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Custo médio</dt>
                    <dd className="tabular-nums">
                      {formatCurrency(price.averageCost)}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">Sem preço registrado.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function useProductPriceForEnterprise(
  prices: { items: Price[] } | undefined,
  productEnterpriseId: string | undefined
) {
  return useMemo(
    () =>
      prices?.items.find((p) => p.productsEnterprisesId === productEnterpriseId),
    [prices, productEnterpriseId]
  )
}
