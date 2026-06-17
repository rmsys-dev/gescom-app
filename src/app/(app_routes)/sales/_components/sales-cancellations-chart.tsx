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
import type { CancellationsAnalytics } from "@/modules/sales/sales-analytics.schema"
import { formatCurrency, formatNumber } from "@/modules/sales/sales-labels"

const chartConfig = {
  lostValue: {
    label: "Valor perdido",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

type SalesCancellationsChartProps = {
  data?: CancellationsAnalytics
  loading?: boolean
}

export function SalesCancellationsChart({
  data,
  loading,
}: SalesCancellationsChartProps) {
  const chartData =
    data?.series.map((point) => ({
      label: point.bucketStart.slice(5),
      count: point.count,
      lostValue: point.lostValue,
    })) ?? []

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cancelamentos</CardTitle>
        <CardDescription>
          {data
            ? `${formatNumber(data.cancellationCount)} cancelamentos · ${formatCurrency(data.lostValue)} perdidos`
            : "Vendas canceladas no período"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[220px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center border border-dashed text-sm text-muted-foreground">
            Sem cancelamentos no período seleccionado.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrency(v)}
                width={72}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <span>
                        {formatCurrency(Number(value))} ·{" "}
                        {formatNumber(item.payload.count)} cancelamentos
                      </span>
                    )}
                  />
                }
              />
              <Bar
                dataKey="lostValue"
                fill="var(--color-lostValue)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
