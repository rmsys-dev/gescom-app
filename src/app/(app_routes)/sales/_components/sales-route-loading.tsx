import { Skeleton } from "@/components/ui/skeleton"
import type { SalesListRouteConfig } from "@/modules/sales/sales-route-config"

const SKELETON_ROW_COUNT = 8

function ListContentLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-3 w-16" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[62px] rounded-lg" />
          <Skeleton className="h-[62px] rounded-lg" />
          <Skeleton className="h-[62px] rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-48" />
        <div className="overflow-hidden rounded-lg border">
          <div className="border-b bg-muted/40 px-4 py-3">
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-3" />
              ))}
            </div>
          </div>
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
            <div
              key={i}
              className={
                "border-b px-4 py-3 last:border-0" +
                (i % 2 === 1 ? " bg-muted/20" : "")
              }
            >
              <div className="grid grid-cols-6 items-center gap-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40 rounded-lg" />
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="size-7 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

export function SalesContentLoading({
  config,
}: {
  config?: SalesListRouteConfig
}) {
  return (
    <ListContentLoading
      label={config?.labels.loadingList ?? "A carregar vendas"}
    />
  )
}

export function SalesDashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar dashboard de vendas"
      className="space-y-6"
    >
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-80" />
      <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[62px] rounded-lg" />
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-lg" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
    </div>
  )
}

export function SaleDetailLoading({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="A carregar detalhe da venda"
        className="space-y-4"
      >
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-4 w-40" />
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar detalhe da venda"
      className="space-y-6"
    >
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-56 w-full rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  )
}
