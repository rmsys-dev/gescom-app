import { Skeleton } from "@/components/ui/skeleton"

export function HomeRouteLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar"
      className="flex min-h-svh flex-col items-center justify-center gap-4 p-6"
    >
      <Skeleton className="size-12" />
      <Skeleton className="h-4 w-36" />
    </div>
  )
}
