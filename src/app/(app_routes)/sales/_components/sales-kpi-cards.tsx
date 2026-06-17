"use client"

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { KpiValue } from "@/modules/sales/sales-analytics.schema"
import {
  deltaTone,
  formatCurrency,
  formatDelta,
  formatNumber,
} from "@/modules/sales/sales-labels"

type KpiCardProps = {
  label: string
  value: string
  delta?: KpiValue
  loading?: boolean
}

function KpiCard({ label, value, delta, loading }: KpiCardProps) {
  const tone = deltaTone(delta?.changePercent)

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-16" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {delta && delta.changePercent !== undefined && (
          <div
            className={cn(
              "mt-2 inline-flex items-center gap-1 border px-2 py-0.5 text-xs font-medium",
              tone === "positive" &&
              "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
              tone === "negative" &&
              "bg-red-500/10 text-red-700 dark:text-red-300",
              tone === "neutral" && "bg-muted text-muted-foreground"
            )}
          >
            {tone === "positive" && <ArrowUpRight className="size-3" />}
            {tone === "negative" && <ArrowDownRight className="size-3" />}
            {tone === "neutral" && <Minus className="size-3" />}
            {formatDelta(delta)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type SalesKpiCardsProps = {
  kpis?: {
    grossRevenue: KpiValue
    netRevenue: KpiValue
    salesCount: KpiValue
    averageTicket: KpiValue
    itemsSold: KpiValue
    discountTotal: KpiValue
    returnsTotal: KpiValue & { returnCount?: number }
  }
  loading?: boolean
}

export function SalesKpiCards({ kpis, loading }: SalesKpiCardsProps) {
  const cards = [
    {
      label: "Faturamento bruto",
      value: formatCurrency(kpis?.grossRevenue.value),
      delta: kpis?.grossRevenue,
    },
    {
      label: "Receita líquida",
      value: formatCurrency(kpis?.netRevenue.value),
      delta: kpis?.netRevenue,
    },
    {
      label: "Vendas finalizadas",
      value: formatNumber(kpis?.salesCount.value),
      delta: kpis?.salesCount,
    },
    {
      label: "Ticket médio",
      value: formatCurrency(kpis?.averageTicket.value),
      delta: kpis?.averageTicket,
    },
    {
      label: "Itens vendidos",
      value: formatNumber(kpis?.itemsSold.value),
      delta: kpis?.itemsSold,
    },
    {
      label: "Descontos",
      value: formatCurrency(kpis?.discountTotal.value),
      delta: kpis?.discountTotal,
    },
    {
      label: "Devoluções",
      value: formatCurrency(kpis?.returnsTotal.value),
      delta: kpis?.returnsTotal,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <KpiCard
          key={card.label}
          label={card.label}
          value={card.value}
          delta={card.delta}
          loading={loading}
        />
      ))}
    </div>
  )
}
