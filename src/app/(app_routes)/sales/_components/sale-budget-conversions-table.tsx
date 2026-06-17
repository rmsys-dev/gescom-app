"use client"

import Link from "next/link"

import { SalesStatusBadge } from "@/app/(app_routes)/sales/_components/sales-status-badge"
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
import { formatCurrency } from "@/modules/sales/sales-labels"
import type { BudgetConversion } from "@/modules/sales/sales.schema"

type SaleBudgetConversionsTableProps = {
  conversions: BudgetConversion[]
}

export function SaleBudgetConversionsTable({
  conversions,
}: SaleBudgetConversionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Histórico de conversões</CardTitle>
        <CardDescription>
          Vendas geradas a partir deste orçamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {conversions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem conversões.</p>
        ) : (
          <div className="overflow-x-auto border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Pedido gerado</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                  <th className="px-4 py-3 font-medium">Operador</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {conversions.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3">#{item.generatedOrderNumber}</td>
                    <td className="px-4 py-3">
                      <SalesStatusBadge status={item.generatedStatus} />
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(item.generatedValueLiquid)}
                    </td>
                    <td className="px-4 py-3">{item.userLegalName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateOnly(item.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`${SALES_BASE_PATH}/${item.generatedSaleId}`}
                        >
                          Ver
                        </Link>
                      </Button>
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
