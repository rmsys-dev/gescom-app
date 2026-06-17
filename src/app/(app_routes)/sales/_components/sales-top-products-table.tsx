"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { TopProductsResponse } from "@/modules/sales/sales-analytics.schema"
import type { TopProductsSortBy } from "@/modules/sales/sales-analytics.schema"
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/modules/sales/sales-labels"

type SalesTopProductsTableProps = {
  data?: TopProductsResponse
  loading?: boolean
  sortBy: TopProductsSortBy
  onSortByChange: (sortBy: TopProductsSortBy) => void
}

export function SalesTopProductsTable({
  data,
  loading,
  sortBy,
  onSortByChange,
}: SalesTopProductsTableProps) {
  const items = data?.items ?? []

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Top produtos</CardTitle>
          <CardDescription>Produtos com maior receita ou quantidade</CardDescription>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={sortBy === "revenue" ? "default" : "outline"}
            onClick={() => onSortByChange("revenue")}
          >
            Receita
          </Button>
          <Button
            type="button"
            size="sm"
            variant={sortBy === "quantity" ? "default" : "outline"}
            onClick={() => onSortByChange("quantity")}
          >
            Quantidade
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
            Sem produtos no período seleccionado.
          </div>
        ) : (
          <div className="overflow-x-auto border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Receita</th>
                  <th className="px-4 py-3 font-medium">Qtd.</th>
                  <th className="px-4 py-3 font-medium">Partilha</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.label}</p>
                      {item.code !== null && (
                        <p className="text-xs text-muted-foreground">
                          Cód. {item.code}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">{formatCurrency(item.revenue)}</td>
                    <td className="px-4 py-3">{formatNumber(item.quantity)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatPercent(item.sharePercent)}
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