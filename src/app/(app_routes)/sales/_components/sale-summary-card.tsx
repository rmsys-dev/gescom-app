"use client"

import { BudgetClosureBadge } from "@/app/(app_routes)/sales/_components/budget-closure-badge"
import { SalesStatusBadge } from "@/app/(app_routes)/sales/_components/sales-status-badge"
import { SalesTypeBadge } from "@/app/(app_routes)/sales/_components/sales-type-badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDateOnly, formatPersonName } from "@/lib/formatters"
import {
  BUDGET_CLOSURE_LABELS,
  RETURN_SITUATION_LABELS,
  formatCurrency,
} from "@/modules/sales/sales-labels"
import type { SaleDetail } from "@/modules/sales/sales.schema"

type SaleSummaryCardProps = {
  sale: SaleDetail
}

export function SaleSummaryCard({
  sale,
}: SaleSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <CardTitle className="text-md">
            {sale.type === "ORCAMENTO" ? "Orçamento" : "Pedido"} #{sale.orderNumber}
          </CardTitle>
          <div className="flex items-center gap-2">
            <SalesTypeBadge type={sale.type} />
            {sale.type === "ORCAMENTO" ? (
              <BudgetClosureBadge situation={sale.budgetClosureSituation} />
            ) : (
              <SalesStatusBadge status={sale.status} />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Vendedor</dt>
            <dd className="text-foreground">
              {formatPersonName(sale.sellerLegalName)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Cliente</dt>
            <dd className="text-foreground">
              {formatPersonName(sale.memberName)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Subtotal</dt>
            <dd className="text-foreground">{formatCurrency(sale.subTotal)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Valor líquido</dt>
            <dd className="text-foreground">
              {formatCurrency(sale.valueLiquid)}
            </dd>
          </div>
          {sale.type !== "ORCAMENTO" && (
            <div>
              <dt className="text-xs text-muted-foreground">Devolução</dt>
              <dd className="text-foreground">{RETURN_SITUATION_LABELS[sale.returnSituation]}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-muted-foreground">
              {sale.type === "ORCAMENTO" ? "Fechamento orçamento" : "Finalização"}
            </dt>
            <dd>
              {sale.type === "ORCAMENTO"
                ? BUDGET_CLOSURE_LABELS[sale.budgetClosureSituation]
                : <span className="text-foreground">{formatDateOnly(sale.completedionDate ?? sale.createdAt)}</span>}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
