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
import type { BudgetFunnel } from "@/modules/sales/sales-analytics.schema"
import { BUDGET_CLOSURE_LABELS } from "@/modules/sales/sales-labels"
import { formatCurrency, formatNumber } from "@/modules/sales/sales-labels"

const chartConfig = {
  value: {
    label: "Valor",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

type SalesFunnelChartProps = {
  data?: BudgetFunnel
  loading?: boolean
}

export function SalesFunnelChart({ data, loading }: SalesFunnelChartProps) {
  const chartData =
    data?.funnel.map((item) => ({
      situation: BUDGET_CLOSURE_LABELS[item.situation] ?? item.situation,
      count: item.count,
      value: item.value,
      sharePercent: item.sharePercent,
    })) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de orçamentos</CardTitle>
        <CardDescription>
          Orçamentos abertos criados no período ·{" "}
          {data ? formatNumber(data.totalCount) : "—"} documentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center border border-dashed text-sm text-muted-foreground">
            Sem orçamentos no período seleccionado.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="situation" tickLine={false} axisLine={false} />
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
                        {formatNumber(item.payload.count)} orçamentos
                      </span>
                    )}
                  />
                }
              />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
