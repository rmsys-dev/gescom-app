"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ProductStatusBadge } from "@/app/(app_routes)/products/_components/product-status-badge"
import { PRODUCTS_BASE_PATH } from "@/app/(app_routes)/products/_components/products-constants"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProductEnterprise } from "@/modules/products/products.schema"
import type { Price, ProductApplication, ProductTaxation, PromotionalPrice } from "@/modules/products/products-tenant-extras.schema"

export function ProductsListHeader({ total }: { total: number }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Produtos
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {total} produto(s) na empresa activa
      </p>
    </div>
  )
}

export function ProductEnterpriseDetailHeader({
  description,
}: {
  description: string
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={PRODUCTS_BASE_PATH} aria-label="Voltar à lista">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {description}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Produto da empresa
          </p>
        </div>
      </div>
    </div>
  )
}

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
              <dd className="text-lg font-semibold">{price.price}</dd>
            </div>
            {price.priceCost && (
              <div>
                <dt className="text-xs text-muted-foreground">Custo</dt>
                <dd>{price.priceCost}</dd>
              </div>
            )}
            {price.averageCost && (
              <div>
                <dt className="text-xs text-muted-foreground">Custo médio</dt>
                <dd>{price.averageCost}</dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">Sem preço registado.</p>
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
          <p className="text-sm text-muted-foreground">Nenhuma promoção activa.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((p) => (
              <li key={p.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{p.price}</p>
                {p.description && (
                  <p className="text-muted-foreground">{p.description}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(p.startDate).toLocaleDateString("pt-BR")} –{" "}
                  {new Date(p.endDate).toLocaleDateString("pt-BR")}
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
          <p className="text-sm text-muted-foreground">Sem tributação registada.</p>
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
          <p className="text-sm text-muted-foreground">Sem aplicações registadas.</p>
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
