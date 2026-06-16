"use client"

import { ProductStatusBadge } from "@/app/(app_routes)/products/_components/product-status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency, formatDateOnly } from "@/lib/formatters"
import type { ProductEnterprise } from "@/modules/products/products.schema"
import type { Price, ProductApplication, ProductTaxation, PromotionalPrice } from "@/modules/products/products-tenant-extras.schema"

export function ProductEnterpriseInfoCard({
  product,
}: {
  product: ProductEnterprise
}) {
  return (
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
          {product.origin && (
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Origem</dt>
              <dd className="text-sm">{product.origin}</dd>
            </div>
          )}
          {product.manufacturer && (
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Fabricante
              </dt>
              <dd className="text-sm">{product.manufacturer}</dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-muted-foreground">ID vínculo</dt>
            <dd className="truncate font-mono text-xs text-muted-foreground">
              {product.id}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

export function ProductPriceSection({
  price,
  canConsult,
}: {
  price: Price | undefined
  canConsult: boolean
}) {
  if (!canConsult) return null
  return (
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
                <dd className="tabular-nums">{formatCurrency(price.averageCost)}</dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">Sem preço registrado.</p>
        )}
      </CardContent>
    </Card>
  )
}

export function ProductPromotionalPricesSection({
  items,
  canConsult,
}: {
  items: PromotionalPrice[]
  canConsult: boolean
}) {
  if (!canConsult) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Preços promocionais</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma promoção ativa.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((p) => (
              <li key={p.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium tabular-nums">{formatCurrency(p.price)}</p>
                {p.description && (
                  <p className="text-muted-foreground">{p.description}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateOnly(p.startDate)} – {formatDateOnly(p.endDate)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function ProductTaxationSection({
  items,
  canConsult,
}: {
  items: ProductTaxation[]
  canConsult: boolean
}) {
  if (!canConsult) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tributação</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem tributação registrada.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {items.map((t) => (
              <li key={t.id} className="rounded-md border p-3 font-mono text-xs">
                PIS entrada: {t.cst_pis_entrada ?? "—"} · PIS saída:{" "}
                {t.cst_pis_saida ?? "—"}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function ProductApplicationsSection({
  items,
  canConsult,
}: {
  items: ProductApplication[]
  canConsult: boolean
}) {
  if (!canConsult) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aplicações</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem aplicações registradas.</p>
        ) : (
          <ul className="list-inside list-disc text-sm">
            {items.map((a) => (
              <li key={a.id}>{a.description}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
