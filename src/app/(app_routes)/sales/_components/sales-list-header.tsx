"use client"

import type { SalesListRouteConfig } from "@/modules/sales/sales-route-config"

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function SalesListHeader({ config }: { config: SalesListRouteConfig }) {
  const title = capitalize(config.labels.plural)
  const subtitle = `Consulte e gerencie ${config.labels.plural}`

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
