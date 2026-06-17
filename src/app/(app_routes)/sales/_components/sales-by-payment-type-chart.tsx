"use client"

import { Cell, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type { RankingResponse } from "@/modules/sales/sales-analytics.schema"
import { formatCurrency, formatPercent } from "@/modules/sales/sales-labels"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

type SalesByPaymentTypeChartProps = {
  data?: RankingResponse
  loading?: boolean
}

export function SalesByPaymentTypeChart({
  data,
  loading,
}: SalesByPaymentTypeChartProps) {
  const items = data?.items ?? []
  const chartConfig = Object.fromEntries(
    items.map((item, i) => [
      item.id,
      { label: item.label, color: COLORS[i % COLORS.length] },
    ])
  ) satisfies ChartConfig

  const chartData = items.map((item, i) => ({
    id: item.id,
    label: item.label,
    revenue: item.revenue,
    sharePercent: item.sharePercent,
    fill: COLORS[i % COLORS.length],
  }))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Formas de pagamento</CardTitle>
        <CardDescription>Distribuição da receita por tipo</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="mx-auto h-[280px] max-w-[280px]" />
        ) : chartData.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center border border-dashed text-sm text-muted-foreground">
            Sem dados para o período seleccionado.
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[240px] max-w-[240px]"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, _name, item) => (
                        <span>
                          {formatCurrency(Number(value))} (
                          {formatPercent(item.payload.sharePercent)})
                        </span>
                      )}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="revenue"
                  nameKey="label"
                  innerRadius={56}
                  outerRadius={96}
                  paddingAngle={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.id} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="flex-1 space-y-2 text-sm">
              {chartData.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span
                      className="size-2.5 shrink-0 border"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {formatPercent(item.sharePercent)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
