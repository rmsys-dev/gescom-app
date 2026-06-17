"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type { RealizedTimeseries } from "@/modules/sales/sales-analytics.schema"
import { formatCurrency } from "@/modules/sales/sales-labels"

const chartConfig = {
  grossRevenue: {
    label: "Faturamento bruto",
    color: "var(--chart-1)",
  },
  netRevenue: {
    label: "Receita líquida",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type SalesTimeseriesChartProps = {
  data?: RealizedTimeseries
  loading?: boolean
}

export function SalesTimeseriesChart({
  data,
  loading,
}: SalesTimeseriesChartProps) {
  const chartData =
    data?.series.map((point) => ({
      label: point.bucketLabel,
      grossRevenue: point.grossRevenue ?? 0,
      netRevenue: point.netRevenue ?? 0,
    })) ?? []

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Evolução da receita</CardTitle>
        <CardDescription>
          {data
            ? `${data.period.from} — ${data.period.to}`
            : "Receita bruta e líquida por período"}
        </CardDescription>
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
            <AreaChart data={chartData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  formatCurrency(v).replace(/\s/g, "\u00a0")
                }
                width={72}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="grossRevenue"
                stroke="var(--color-grossRevenue)"
                fill="var(--color-grossRevenue)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="netRevenue"
                stroke="var(--color-netRevenue)"
                fill="var(--color-netRevenue)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
