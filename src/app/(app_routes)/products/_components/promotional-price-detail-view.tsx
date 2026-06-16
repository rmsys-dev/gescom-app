"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency, formatDateOnly } from "@/lib/formatters"
import type { PromotionalPrice } from "@/modules/products/products-tenant-extras.schema"

export function PromotionalPriceDetailView({
  data,
}: {
  data: PromotionalPrice
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Preço promocional</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Preço</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {formatCurrency(data.price)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-muted-foreground">
              Descrição
            </dt>
            <dd className="text-sm">{data.description ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Início</dt>
            <dd className="text-sm tabular-nums">
              {formatDateOnly(data.startDate)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Fim</dt>
            <dd className="text-sm tabular-nums">
              {formatDateOnly(data.endDate)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
