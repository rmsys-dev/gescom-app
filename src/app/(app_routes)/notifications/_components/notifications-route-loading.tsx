import { Skeleton } from "@/components/ui/skeleton"

export function NotificationsRouteLoading() {
  return (
    <main
      className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Carregando notificações"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      <Skeleton className="h-48" />
    </main>
  )
}
