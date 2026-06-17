"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { formatCurrency } from "@/modules/sales/sales-labels"

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type SalesBySellerChartProps = {
  data?: RankingResponse
  loading?: boolean
}

export function SalesBySellerChart({ data, loading }: SalesBySellerChartProps) {
  const chartData =
    data?.items.map((item) => ({
      label:
        item.label.length > 18 ? `${item.label.slice(0, 18)}…` : item.label,
      fullLabel: item.label,
      revenue: item.revenue,
      salesCount: item.salesCount ?? 0,
    })) ?? []

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top vendedores</CardTitle>
        <CardDescription>Ranking por receita no período</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center border border-dashed text-sm text-muted-foreground">
            Sem dados para o período seleccionado.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 8, right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrency(v)}
              />
              <YAxis
                type="category"
                dataKey="label"
                tickLine={false}
                axisLine={false}
                width={96}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.fullLabel ?? ""
                    }
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                }
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
