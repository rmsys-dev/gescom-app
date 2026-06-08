import { Skeleton } from "@/components/ui/skeleton"

export function HomeRouteLoading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar home"
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
    >
      <div className="w-full max-w-sm space-y-4">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </main>
  )
}
