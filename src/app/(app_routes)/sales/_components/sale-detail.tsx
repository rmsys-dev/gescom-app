"use client"

import Link from "next/link"

import { SaleSummaryCard } from "@/app/(app_routes)/sales/_components/sale-summary-card"
import { SalesStatusBadge } from "@/app/(app_routes)/sales/_components/sales-status-badge"
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
import { formatCurrency, formatQuantity } from "@/modules/sales/sales-labels"
import type { SaleDetail } from "@/modules/sales/sales.schema"

type SaleDetailViewProps = {
  sale: SaleDetail
}

export function SaleDetailView({ sale }: SaleDetailViewProps) {
  return (
    <div className="space-y-6">
      <RouteBreadcrumb currentLabel={`Pedido #${sale.orderNumber}`} />

      <SaleSummaryCard
        sale={sale}
      />

      <SaleItemsTable items={sale.items} />
      <SalePaymentsSection payments={sale.payments} />

      {sale.type === "ORCAMENTO" && sale.generatedSales && (
        <SaleGeneratedSalesTable items={sale.generatedSales} />
      )}

      {sale.sourceBudget && (
        <Card>
          <CardContent className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Orçamento de origem: #{sale.sourceBudget.orderNumber}
            </p>
            <Button variant="default" size="sm" asChild>
              <Link href={`${SALES_BASE_PATH}/${sale.sourceBudget.id}`}>
                Ver
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
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {formatQuantity(item.quantity)}
                    </td>
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
        <CardDescription>{payments.reduce((acc, payment) => acc + payment.dues.length, 0)} pagamento(s)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem pagamentos.</p>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="rounded-lg border">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
                <p className="text-foreground">
                  <span className="text-muted-foreground">Formato de recebimento:</span>{" "}
                  {payment.dues.length === 1
                    ? "Venda à vista"
                    : `Venda parcelada em ${payment.dues.length}x`}
                </p>
              </div>
              {payment.dues.length > 0 && (
                <ul className="px-4 py-3 a space-y-1 text-sm text-foreground">
                  {payment.dues.map((due, index) => (
                    <li key={due.id} className="flex justify-between gap-2">
                      <span className="my-1">
                        {payment.dues.length === 1
                          ? "À vista"
                          : `Parcela ${index + 1}`}{" "}
                        · {formatDateOnly(due.dueDate)}
                      </span>
                      <span className="text-base">{formatCurrency(due.valueInstallment)}</span>
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
                    <Button variant="default" size="sm" asChild>
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
