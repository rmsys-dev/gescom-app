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
import type {
  ReceivablesAging,
  ReceivablesSummary,
} from "@/modules/sales/sales-analytics.schema"
import {
  AGING_BUCKET_LABELS,
  formatCurrency,
  formatNumber,
} from "@/modules/sales/sales-labels"

const chartConfig = {
  total: {
    label: "Valor",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

type SalesAgingChartProps = {
  summary?: ReceivablesSummary
  aging?: ReceivablesAging
  loading?: boolean
}

export function SalesAgingChart({
  summary,
  aging,
  loading,
}: SalesAgingChartProps) {
  const chartData =
    aging?.buckets.map((bucket) => ({
      bucket: AGING_BUCKET_LABELS[bucket.bucket] ?? bucket.bucket,
      total: bucket.total,
      count: bucket.count,
      sharePercent: bucket.sharePercent,
    })) ?? []

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Contas a receber</CardTitle>
        <CardDescription>Aging de parcelas em aberto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
            <Skeleton className="h-[220px] w-full" />
          </>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Total a receber</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(summary?.totalOutstanding)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(summary?.dueCount)} parcelas
                </p>
              </div>
              <div className="border bg-red-500/5 p-3">
                <p className="text-xs text-muted-foreground">Vencido</p>
                <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                  {formatCurrency(summary?.overdueTotal)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(summary?.overdueCount)} parcelas
                </p>
              </div>
              <div className="border bg-emerald-500/5 p-3">
                <p className="text-xs text-muted-foreground">A vencer</p>
                <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(summary?.upcomingTotal)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(summary?.upcomingCount)} parcelas
                </p>
              </div>
            </div>

            {chartData.length === 0 ? (
              <div className="flex h-[220px] items-center justify-center border border-dashed text-sm text-muted-foreground">
                Sem parcelas em aberto.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="bucket"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatCurrency(v)}
                    width={72}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    }
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--color-total)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
