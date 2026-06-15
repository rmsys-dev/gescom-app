import { Skeleton } from "@/components/ui/skeleton"

export function SupportRouteLoading() {
  return (
    <main
      className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Carregando suporte"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </main>
  )
}
