import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function ProductsContentLoading() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar produtos"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
        <Skeleton className="h-9 w-full rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>

      <Skeleton className="h-4 w-48" />

      <div className="overflow-hidden rounded-lg border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`border-b px-4 py-3 last:border-0 ${i % 2 === 1 ? "bg-muted/20" : ""}`}
          >
            <div className="grid grid-cols-5 items-center gap-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-4 w-2/5" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-8 w-64" />
      </div>
    </div>
  )
}

export function ProductDetailContentLoading({
  compact = false,
}: {
  compact?: boolean
}) {
  return (
    <div
      className={compact ? "space-y-4" : "space-y-6"}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar produto"
    >
      {!compact && (
        <>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-44 w-full rounded-lg" />
        </>
      )}
      <div
        className={cn(
          "grid gap-4",
          compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-2"
        )}
      >
        <Skeleton className="h-36 w-full rounded-lg" />
        <Skeleton className="h-36 w-full rounded-lg" />
        {!compact && (
          <>
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="col-span-full h-32 w-full rounded-lg" />
          </>
        )}
      </div>
    </div>
  )
}

export function ProductsRouteLoading() {
  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <ProductsContentLoading />
    </main>
  )
}
