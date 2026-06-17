import { Bell } from "lucide-react"

export function NotificationsEmptyState() {
  return (
    <div
      role="status"
      className="border border-dashed bg-card px-6 py-16 text-center"
    >
      <Bell
        className="mx-auto mb-4 size-10 text-muted-foreground/40"
        aria-hidden
      />
      <p className="font-semibold text-foreground">Nenhuma notificação</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Quando houver avisos ou atualizações, eles aparecerão aqui.
      </p>
    </div>
  )
}
