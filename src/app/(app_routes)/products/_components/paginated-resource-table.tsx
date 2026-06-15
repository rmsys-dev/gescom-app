"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ResourceColumn<T> = {
  header: string
  cell: (item: T) => ReactNode
  mobileLabel?: string
  mobilePrimary?: boolean
}

type PaginatedResourceTableProps<T extends { id: string }> = {
  items: T[]
  total: number
  limit: number
  offset: number
  onPageChange: (offset: number) => void
  basePath: string
  emptyTitle: string
  emptyDescription: string
  columns: ResourceColumn<T>[]
  mobileTitle: (item: T) => string
  mobileSubtitle?: (item: T) => string
}

export function PaginatedResourceTable<T extends { id: string }>({
  items,
  total,
  limit,
  offset,
  onPageChange,
  basePath,
  emptyTitle,
  emptyDescription,
  columns,
  mobileTitle,
  mobileSubtitle,
}: PaginatedResourceTableProps<T>) {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = offset > 0
  const canNext = offset + limit < total

  function renderDataRow(item: T) {
    return (
      <tr key={item.id} className="border-b last:border-0">
        {columns.map((col) => (
          <td key={col.header} className="px-4 py-3">
            {col.cell(item)}
          </td>
        ))}
        <td className="px-4 py-3 text-right">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`${basePath}/${item.id}`}>
              <Eye className="mr-1 size-4" />
              Ver
            </Link>
          </Button>
        </td>
      </tr>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card px-6 py-12 text-center">
        <p className="font-medium text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className="px-4 py-3 font-medium">
                  {col.header}
                </th>
              ))}
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>{items.map((item) => renderDataRow(item))}</tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`${basePath}/${item.id}`}
            className="block rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
          >
            <p className="font-medium">{mobileTitle(item)}</p>
            {mobileSubtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {mobileSubtitle(item)}
              </p>
            )}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          Página {page} de {totalPages} · {total} registo(s)
        </p>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canPrev}
            onClick={() => onPageChange(Math.max(0, offset - limit))}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canNext}
            onClick={() => onPageChange(offset + limit)}
            aria-label="Página seguinte"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
