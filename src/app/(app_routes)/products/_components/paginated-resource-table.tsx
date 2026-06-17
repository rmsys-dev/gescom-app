"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Eye, SearchX } from "lucide-react"

import { PaginatedListControls } from "@/app/(app_routes)/products/_components/paginated-list-controls"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  onLimitChange?: (limit: number) => void
  basePath?: string
  showDetailLink?: boolean
  emptyTitle: string
  emptyDescription: string
  columns: ResourceColumn<T>[]
  mobileTitle: (item: T) => string
  mobileSubtitle?: (item: T) => string
  onClearFilters?: () => void
  listLabel?: string
}

export function PaginatedResourceTable<T extends { id: string }>({
  items,
  total,
  limit,
  offset,
  onPageChange,
  onLimitChange,
  basePath,
  showDetailLink = false,
  emptyTitle,
  emptyDescription,
  columns,
  mobileTitle,
  mobileSubtitle,
  onClearFilters,
  listLabel = "Lista de registros",
}: PaginatedResourceTableProps<T>) {
  const canLinkToDetail = showDetailLink && Boolean(basePath)

  if (items.length === 0) {
    return (
      <div
        role="status"
        className="border border-dashed bg-card px-6 py-16 text-center"
      >
        <SearchX
          className="mx-auto mb-4 size-10 text-muted-foreground/40"
          aria-hidden
        />
        <p className="font-semibold text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
        {onClearFilters && (
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={onClearFilters}
          >
            Limpar filtros
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden border md:block">
        <table className="w-full text-sm" aria-label={listLabel}>
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              {columns.map((col) => (
                <th key={col.header} scope="col" className="px-4 py-3 font-medium">
                  {col.header}
                </th>
              ))}
              {canLinkToDetail && (
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"
                >
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={cn(
                  "border-b transition-colors last:border-0",
                  "hover:bg-primary/5",
                  idx % 2 === 1 && "bg-muted/20"
                )}
              >
                {columns.map((col) => (
                  <td key={col.header} className="px-4 py-3">
                    {col.cell(item)}
                  </td>
                ))}
                {canLinkToDetail && (
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`${basePath}/${item.id}`}>
                        <Eye className="mr-1 size-4" aria-hidden />
                        Ver
                      </Link>
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => {
          const content = (
            <>
              <p className="font-medium">{mobileTitle(item)}</p>
              {mobileSubtitle && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {mobileSubtitle(item)}
                </p>
              )}
            </>
          )

          if (canLinkToDetail) {
            return (
              <Link
                key={item.id}
                href={`${basePath}/${item.id}`}
                className="block border bg-card p-4 shadow-sm transition-colors hover:bg-primary/5"
              >
                {content}
              </Link>
            )
          }

          return (
            <div
              key={item.id}
              className="border bg-card p-4 shadow-sm"
            >
              {content}
            </div>
          )
        })}
      </div>

      <PaginatedListControls
        total={total}
        limit={limit}
        offset={offset}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  )
}
