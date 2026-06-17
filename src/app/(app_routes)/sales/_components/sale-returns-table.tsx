"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDateOnly } from "@/lib/formatters"
import {
  SALE_RETURN_KIND_LABELS,
  SALE_RETURN_STATUS_LABELS,
  formatCurrency,
} from "@/modules/sales/sales-labels"
import type { SaleReturn } from "@/modules/sales/sales.schema"

type SaleReturnsTableProps = {
  returns: SaleReturn[]
}

export function SaleReturnsTable({ returns }: SaleReturnsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Devoluções</CardTitle>
        <CardDescription>{returns.length} devolução(ões)</CardDescription>
      </CardHeader>
      <CardContent>
        {returns.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem devoluções.</p>
        ) : (
          <div className="overflow-x-auto border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nº</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3">#{item.returnNumber}</td>
                    <td className="px-4 py-3">
                      {SALE_RETURN_KIND_LABELS[item.kind]}
                    </td>
                    <td className="px-4 py-3">
                      {SALE_RETURN_STATUS_LABELS[item.status]}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(item.valueTotal)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateOnly(item.createdAt)}
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
