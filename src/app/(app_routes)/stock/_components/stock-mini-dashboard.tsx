"use client"

import Link from "next/link"
import {
  ArrowLeftRight,
  ArrowUpDown,
  Layers,
  MapPin,
  Package,
  Scale,
  Warehouse,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  STOCK_RESOURCE_CONFIGS,
  type StockResourceConfig,
  type StockResourceSlug,
} from "@/app/(app_routes)/stock/_components/stock-config"
import { Skeleton } from "@/components/ui/skeleton"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import {
  useStockBatchBalancesQuery,
  useStockBatchesQuery,
  useStockLocationsQuery,
  useStockMinMaxQuery,
  useStockSectorRentalsQuery,
  useStockSectorsQuery,
} from "@/modules/stock/use-stock"

const DASHBOARD_SLUGS: StockResourceSlug[] = [
  "sectors",
  "locations",
  "batches",
  "sector-rentals",
  "batch-balances",
  "min-max",
]

const DASHBOARD_ICONS: Record<StockResourceSlug, LucideIcon> = {
  sectors: Warehouse,
  locations: MapPin,
  batches: Package,
  "sector-rentals": Layers,
  "batch-balances": Scale,
  "min-max": ArrowUpDown,
  movements: ArrowLeftRight,
}

const METRIC_LABELS: Record<StockResourceSlug, string> = {
  sectors: "Setores",
  locations: "Locações",
  batches: "Lotes",
  "sector-rentals": "Saldos por locação",
  "batch-balances": "Saldos por lote",
  "min-max": "Regras mín/máx",
  movements: "Movimentos",
}

type MetricCardProps = {
  config: StockResourceConfig
  total: number | undefined
  isLoading: boolean
  canConsult: boolean
}

function MetricCard({ config, total, isLoading, canConsult }: MetricCardProps) {
  const Icon = DASHBOARD_ICONS[config.slug]

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {METRIC_LABELS[config.slug]}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
            {isLoading ? (
              <Skeleton className="inline-block h-9 w-16" />
            ) : !canConsult ? (
              "—"
            ) : (
              (total ?? 0).toLocaleString("pt-BR")
            )}
          </p>
        </div>
        <div className="border bg-muted/40 p-2.5">
          <Icon className="size-5 text-muted-foreground" aria-hidden />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{config.description}</p>
    </>
  )

  if (!canConsult) {
    return (
      <div className="border bg-card p-4 shadow-sm opacity-60">
        {content}
      </div>
    )
  }

  return (
    <Link
      href={config.basePath}
      className="border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40"
    >
      {content}
    </Link>
  )
}

function useStockDashboardMetrics(enabled: boolean, perms: ReturnType<typeof useOperatorPermissions>) {
  const filters = { limit: 1, offset: 0 }

  const sectors = useStockSectorsQuery({
    filters,
    enabled: enabled && perms.canConsultStockSectors,
  })
  const locations = useStockLocationsQuery({
    filters,
    enabled: enabled && perms.canConsultStockLocations,
  })
  const batches = useStockBatchesQuery({
    filters,
    enabled: enabled && perms.canConsultStockBatches,
  })
  const sectorRentals = useStockSectorRentalsQuery({
    filters,
    enabled: enabled && perms.canConsultStockBalances,
  })
  const batchBalances = useStockBatchBalancesQuery({
    filters,
    enabled: enabled && perms.canConsultStockBatchBalances,
  })
  const minMax = useStockMinMaxQuery({
    filters,
    enabled: enabled && perms.canConsultStockMinMax,
  })

  return {
    sectors: { total: sectors.data?.total, isLoading: sectors.isPending },
    locations: { total: locations.data?.total, isLoading: locations.isPending },
    batches: { total: batches.data?.total, isLoading: batches.isPending },
    "sector-rentals": {
      total: sectorRentals.data?.total,
      isLoading: sectorRentals.isPending,
    },
    "batch-balances": {
      total: batchBalances.data?.total,
      isLoading: batchBalances.isPending,
    },
    "min-max": { total: minMax.data?.total, isLoading: minMax.isPending },
  } as const
}

export function StockMiniDashboard() {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const queryEnabled = ready && perms.isReady

  const metrics = useStockDashboardMetrics(queryEnabled, perms)

  const dashboardConfigs = STOCK_RESOURCE_CONFIGS.filter((config) =>
    DASHBOARD_SLUGS.includes(config.slug)
  )

  if (!ready || !perms.isReady) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardConfigs.map((config) => (
          <div
            key={config.slug}
            className="border bg-card p-4 shadow-sm"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-9 w-16" />
            <Skeleton className="mt-3 h-3 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardConfigs.map((config) => {
          const metric = metrics[config.slug as keyof typeof metrics]
          return (
            <MetricCard
              key={config.slug}
              config={config}
              total={metric.total}
              isLoading={metric.isLoading}
              canConsult={perms[config.permissionKey]}
            />
          )
        })}
      </div>

      {perms.canConsultStockMovements && (
        <Link
          href="/stock/movements"
          className="flex items-center gap-3 border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40"
        >
          <div className="border bg-muted/40 p-2.5">
            <ArrowLeftRight
              className="size-5 text-muted-foreground"
              aria-hidden
            />
          </div>
          <div>
            <p className="font-medium">Movimentos de estoque</p>
            <p className="text-sm text-muted-foreground">
              Histórico de entradas e saídas
            </p>
          </div>
        </Link>
      )}
    </div>
  )
}
