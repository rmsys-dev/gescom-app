import { Skeleton } from "@/components/ui/skeleton"

export function AppRoutesLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar área da aplicação"
      className="flex min-h-svh w-full"
    >
      <aside
        aria-hidden
        className="hidden w-64 shrink-0 flex-col gap-4 border-r bg-sidebar p-4 md:flex"
      >
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="mt-auto h-12 w-full" />
      </aside>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <Skeleton className="min-h-40 w-full" />
          <Skeleton className="min-h-40 w-full" />
        </div>
      </div>
    </div>
  )
}
