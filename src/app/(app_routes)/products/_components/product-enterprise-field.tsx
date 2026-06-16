"use client"

import type { LucideIcon } from "lucide-react"
import {
  Layers,
  Percent,
  Receipt,
  Tag,
} from "lucide-react"

import { ProductStatusBadge } from "@/app/(app_routes)/products/_components/product-status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency, formatDateOnly } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { ProductEnterprise } from "@/modules/products/products.schema"
import type {
  Price,
  ProductApplication,
  ProductTaxation,
  PromotionalPrice,
} from "@/modules/products/products-tenant-extras.schema"

function formatFieldValue(value: string | null | undefined | boolean): string {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "boolean") return value ? "Sim" : "Não"
  return String(value)
}

function ProductField({
  label,
  value,
  mono,
  className,
}: {
  label: string
  value: string | null | undefined | boolean
  mono?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 text-sm",
          mono && "font-mono tabular-nums text-foreground"
        )}
      >
        {formatFieldValue(value)}
      </dd>
    </div>
  )
}

function ProductSectionEmpty({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center"
    >
      <Icon className="mb-3 size-9 text-muted-foreground/50" aria-hidden />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function ProductDetailHeader({ product }: { product: ProductEnterprise }) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex justify-center">
          <div
            className="flex size-24 items-center justify-center rounded-full bg-primary/15 ring-2 ring-background shadow-md"
            aria-hidden
          >
            <p className="font-mono text-lg font-black tabular-nums text-primary">
              #{product.code}
            </p>
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-xl font-semibold sm:text-2xl">
            {product.description}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ProductStatusBadge status={product.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductEnterpriseDetailsCard({
  product,
}: {
  product: ProductEnterprise
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dados cadastrais</CardTitle>
        <CardDescription>Informações complementares do produto</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <ProductField label="Código de barras" value={product.barCode} mono />
          <ProductField
            label="Controla lote"
            value={product.controlsBatch}
          />
          {product.origin && (
            <ProductField label="Origem" value={product.origin} />
          )}
          {product.manufacturer && (
            <ProductField label="Fabricante" value={product.manufacturer} />
          )}
        </dl>
      </CardContent>
    </Card>
  )
}

/** Mantido apenas para imports legados — preferir ProductEnterpriseDetailsCard */
export const ProductEnterpriseInfoCard = ProductEnterpriseDetailsCard

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
        <CardDescription>Valores de venda e custo</CardDescription>
      </CardHeader>
      <CardContent>
        {price ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground">
                Preço de venda
              </dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums">
                {formatCurrency(price.price)}
              </dd>
            </div>
            {price.priceCost != null && (
              <div>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground">
                  Custo
                </dt>
                <dd className="mt-1 tabular-nums">
                  {formatCurrency(price.priceCost)}
                </dd>
              </div>
            )}
            {price.averageCost != null && (
              <div>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground">
                  Custo médio
                </dt>
                <dd className="mt-1 tabular-nums">
                  {formatCurrency(price.averageCost)}
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <ProductSectionEmpty
            icon={Tag}
            title="Sem preço registrado"
            description="Não há preço de venda cadastrado para este produto."
          />
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
        <CardDescription>
          {items.length === 1
            ? "1 promoção cadastrada"
            : `${items.length} promoções cadastradas`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <ProductSectionEmpty
            icon={Percent}
            title="Nenhuma promoção ativa"
            description="Não há preços promocionais vigentes para este produto."
          />
        ) : (
          <ul className="space-y-2" aria-label="Preços promocionais">
            {items.map((promo, index) => (
              <li
                key={promo.id}
                className={cn(
                  "rounded-lg border bg-card p-4 shadow-sm",
                  index % 2 === 1 && "bg-muted/20"
                )}
              >
                <p className="font-medium tabular-nums">
                  {formatCurrency(promo.price)}
                </p>
                {promo.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {promo.description}
                  </p>
                )}
                <p className="mt-2 text-xs tabular-nums text-muted-foreground">
                  {formatDateOnly(promo.startDate)} –{" "}
                  {formatDateOnly(promo.endDate)}
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
        <CardDescription>Códigos CST de PIS e COFINS</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <ProductSectionEmpty
            icon={Receipt}
            title="Sem tributação registrada"
            description="Não há configuração fiscal vinculada a este produto."
          />
        ) : (
          <ul className="space-y-2" aria-label="Tributação">
            {items.map((taxation, index) => (
              <li
                key={taxation.id}
                className={cn(
                  "rounded-lg border p-4 text-sm",
                  index % 2 === 1 && "bg-muted/20"
                )}
              >
                <dl className="grid gap-3 sm:grid-cols-2">
                  <ProductField
                    label="PIS entrada"
                    value={taxation.cst_pis_entrada}
                    mono
                  />
                  <ProductField
                    label="PIS saída"
                    value={taxation.cst_pis_saida}
                    mono
                  />
                  <ProductField
                    label="COFINS entrada"
                    value={taxation.cst_cofins_entrada}
                    mono
                  />
                  <ProductField
                    label="COFINS saída"
                    value={taxation.cst_cofins_saida}
                    mono
                  />
                </dl>
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
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Aplicações</CardTitle>
        <CardDescription>
          {items.length === 1
            ? "1 aplicação cadastrada"
            : `${items.length} aplicações cadastradas`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <ProductSectionEmpty
            icon={Layers}
            title="Sem aplicações registradas"
            description="Não há aplicações vinculadas a este produto."
          />
        ) : (
          <ul className="space-y-2" aria-label="Aplicações do produto">
            {items.map((application, index) => (
              <li
                key={application.id}
                className={cn(
                  "rounded-lg border bg-card px-4 py-3 text-sm shadow-sm",
                  index % 2 === 1 && "bg-muted/20"
                )}
              >
                {application.description}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
