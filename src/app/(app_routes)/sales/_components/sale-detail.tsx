"use client"

import Link from "next/link"

import { SalesStatusBadge } from "@/app/(app_routes)/sales/_components/sales-status-badge"
import { SalesTypeBadge } from "@/app/(app_routes)/sales/_components/sales-type-badge"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDateOnly } from "@/lib/formatters"
import { SALES_BASE_PATH } from "@/modules/sales/sales-constants"
import {
  BUDGET_CLOSURE_LABELS,
  RETURN_SITUATION_LABELS,
  formatCurrency,
} from "@/modules/sales/sales-labels"
import type { SaleDetail } from "@/modules/sales/sales.schema"

type SaleDetailViewProps = {
  sale: SaleDetail
}

export function SaleDetailView({ sale }: SaleDetailViewProps) {
  return (
    <div className="space-y-6">
      <RouteBreadcrumb currentLabel={`Pedido #${sale.orderNumber}`} />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Pedido #{sale.orderNumber}</CardTitle>
            <SalesTypeBadge type={sale.type} />
            <SalesStatusBadge status={sale.status} />
          </div>
          <CardDescription>
            Registado por {sale.UserName}
            {sale.memberName ? ` · Cliente ${sale.memberName}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">Subtotal</dt>
              <dd className="font-medium">{formatCurrency(sale.subTotal)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Valor líquido</dt>
              <dd className="text-lg font-semibold">
                {formatCurrency(sale.valueLiquid)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Devolução</dt>
              <dd>{RETURN_SITUATION_LABELS[sale.returnSituation]}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                {sale.type === "ORCAMENTO" ? "Fecho orçamento" : "Finalização"}
              </dt>
              <dd>
                {sale.type === "ORCAMENTO"
                  ? BUDGET_CLOSURE_LABELS[sale.budgetClosureSituation]
                  : formatDateOnly(sale.completedionDate ?? sale.createdAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <SaleItemsTable items={sale.items} />
      <SalePaymentsSection payments={sale.payments} />

      {sale.type === "ORCAMENTO" && sale.generatedSales && (
        <SaleGeneratedSalesTable items={sale.generatedSales} />
      )}

      {sale.sourceBudget && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orçamento origem</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href={`${SALES_BASE_PATH}/${sale.sourceBudget.id}`}>
                Pedido #{sale.sourceBudget.orderNumber} ·{" "}
                {formatCurrency(sale.sourceBudget.valueLiquid)}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SaleItemsTable({
  items,
}: {
  items: SaleDetail["items"]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Itens</CardTitle>
        <CardDescription>{items.length} item(ns)</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem itens.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Qtd.</th>
                  <th className="px-4 py-3 font-medium">Unit.</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      {item.productDescription ?? item.productsEnterprisesId}
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">
                      {formatCurrency(item.valueUnit)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(item.valueTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SalePaymentsSection({
  payments,
}: {
  payments: SaleDetail["payments"]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pagamentos</CardTitle>
        <CardDescription>{payments.length} pagamento(s)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem pagamentos.</p>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  {payment.paymentTypeDescription ?? payment.paymentTypeId}
                </p>
                <p className="font-semibold">
                  {formatCurrency(payment.valueTotal)}
                </p>
              </div>
              {payment.dues.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {payment.dues.map((due, index) => (
                    <li key={due.id} className="flex justify-between gap-2">
                      <span>
                        Parcela {index + 1} ·{" "}
                        {formatDateOnly(due.dueDate)}
                      </span>
                      <span>{formatCurrency(due.valueInstallment)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function SaleGeneratedSalesTable({
  items,
}: {
  items: NonNullable<SaleDetail["generatedSales"]>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Vendas geradas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="px-4 py-3">#{item.orderNumber}</td>
                  <td className="px-4 py-3">
                    <SalesStatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(item.valueLiquid)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`${SALES_BASE_PATH}/${item.id}`}>Ver</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
