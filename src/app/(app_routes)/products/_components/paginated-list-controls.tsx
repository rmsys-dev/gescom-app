"use client"

import { useMemo } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PAGE_SIZE_OPTIONS = [20, 50, 100]

type PaginatedListControlsProps = {
  total: number
  limit: number
  offset: number
  onPageChange: (offset: number) => void
  onLimitChange?: (limit: number) => void
}

export function PaginatedListControls({
  total,
  limit,
  offset,
  onPageChange,
  onLimitChange,
}: PaginatedListControlsProps) {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = offset > 0
  const canNext = offset + limit < total

  const pageNumbers = useMemo(() => {
    const total5 = Math.min(5, totalPages)
    let start: number
    if (totalPages <= 5) start = 1
    else if (page <= 3) start = 1
    else if (page >= totalPages - 2) start = totalPages - 4
    else start = page - 2
    return Array.from({ length: total5 }, (_, i) => start + i)
  }, [page, totalPages])

  return (
    <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="shrink-0">Registros por página:</span>
        <Select
          value={String(limit)}
          onValueChange={(v) => onLimitChange?.(Number(v))}
          disabled={!onLimitChange}
        >
          <SelectTrigger
            className="h-7 w-[72px] text-xs"
            aria-label="Registros por página"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className="flex items-center gap-1"
        role="navigation"
        aria-label="Paginação"
      >
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canPrev}
          onClick={() => onPageChange(0)}
          tooltip="Primeira página"
          aria-label="Primeira página"
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canPrev}
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          tooltip="Página anterior"
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            type="button"
            variant={pageNum === page ? "default" : "outline"}
            size="icon-sm"
            onClick={() => onPageChange((pageNum - 1) * limit)}
            aria-label={`Página ${pageNum}`}
            aria-current={pageNum === page ? "page" : undefined}
          >
            {pageNum}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canNext}
          onClick={() => onPageChange(offset + limit)}
          tooltip="Próxima página"
          aria-label="Próxima página"
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canNext}
          onClick={() => onPageChange((totalPages - 1) * limit)}
          tooltip="Última página"
          aria-label="Última página"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>

      <span
        className="text-sm text-muted-foreground"
        aria-live="polite"
        aria-atomic="true"
      >
        Página {page} de {totalPages}
      </span>
    </div>
  )
}
