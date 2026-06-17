"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { StatusBreakdown } from "@/modules/sales/sales-analytics.schema"
import {
  SALE_STATUS_LABELS,
  SALE_TYPE_LABELS,
  formatCurrency,
  formatNumber,
} from "@/modules/sales/sales-labels"

type SalesOperationsTableProps = {
  data?: StatusBreakdown
  loading?: boolean
}

export function SalesOperationsTable({
  data,
  loading,
}: SalesOperationsTableProps) {
  const rows = data?.breakdown ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operação por status</CardTitle>
        <CardDescription>
          Distribuição de vendas e orçamentos por tipo e status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
            Sem dados operacionais no período seleccionado.
          </div>
        ) : (
          <div className="overflow-x-auto border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Quantidade</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={`${row.type}-${row.status}-${index}`}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-3">
                      {SALE_TYPE_LABELS[row.type] ?? row.type}
                    </td>
                    <td className="px-4 py-3">
                      {SALE_STATUS_LABELS[row.status] ?? row.status}
                    </td>
                    <td className="px-4 py-3">{formatNumber(row.count)}</td>
                    <td className="px-4 py-3">{formatCurrency(row.value)}</td>
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
