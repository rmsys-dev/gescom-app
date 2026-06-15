"use client"

import { useMemo } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { formatPhone } from "@/lib/formatters"
import type { User } from "@/modules/users/users.schema"

type LinkClientUsersTableProps = {
  items: User[]
  total: number
  limit: number
  offset: number
  selectedUserId: string | null
  onSelectUser: (userId: string) => void
  onPageChange: (offset: number) => void
  onLimitChange?: (limit: number) => void
  onClearFilters?: () => void
  nameFilterActive: boolean
  emptyTitle: string
  emptyHint: string
  pageSizeOptions?: number[]
}

const DEFAULT_PAGE_SIZE_OPTIONS = [20, 50, 100]

export function LinkClientUsersTable({
  items,
  total,
  limit,
  offset,
  selectedUserId,
  onSelectUser,
  onPageChange,
  onLimitChange,
  onClearFilters,
  emptyTitle,
  emptyHint,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: LinkClientUsersTableProps) {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = offset > 0
  const canNext = offset + limit < total
  const rangeStart = total === 0 ? 0 : offset + 1
  const rangeEnd = Math.min(offset + limit, total)

  const pageNumbers = useMemo(() => {
    const total5 = Math.min(5, totalPages)
    let start: number
    if (totalPages <= 5) start = 1
    else if (page <= 3) start = 1
    else if (page >= totalPages - 2) start = totalPages - 4
    else start = page - 2
    return Array.from({ length: total5 }, (_, i) => start + i)
  }, [page, totalPages])

  function renderUserRow(item: User, idx: number) {
    const selected = selectedUserId === item.id
    return (
      <tr
        key={item.id}
        role="row"
        tabIndex={0}
        aria-label={`Selecionar ${item.userName}`}
        className={cn(
          "cursor-pointer border-b transition-colors last:border-0",
          "hover:bg-primary/5 focus-within:bg-primary/5",
          selected && "bg-primary/5",
          idx % 2 === 1 && "bg-muted/20"
        )}
        onClick={() => onSelectUser(item.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onSelectUser(item.id)
          }
        }}
      >
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <input
            type="radio"
            name="link-user"
            checked={selected}
            onChange={() => onSelectUser(item.id)}
            aria-label={`Selecionar ${item.userName}`}
            className="size-4 accent-primary"
          />
        </td>
        <td className="px-4 py-3 font-medium">{item.userName}</td>
        <td
          className="max-w-[200px] truncate px-4 py-3"
          title={item.userEmail}
        >
          {item.userEmail}
        </td>
        <td className="px-4 py-3 tabular-nums text-muted-foreground">
          {formatPhone(item.userPhone)}
        </td>
      </tr>
    )
  }

  if (items.length === 0) {
    return (
      <div
        role="status"
        className="rounded-lg border border-dashed bg-card px-6 py-16 text-center"
      >
        <SearchX
          className="mx-auto mb-4 size-10 text-muted-foreground/40"
          aria-hidden
        />
        <p className="font-semibold text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
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
      <p
        className="text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {total === 1
          ? "1 registro encontrado"
          : `Mostrando ${rangeStart}–${rangeEnd} de ${total} registros`}
      </p>

      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table
          className="w-full text-sm"
          aria-label="Lista de usuários para vincular como cliente"
        >
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-3" scope="col" aria-label="Selecionar" />
              <th className="px-4 py-3 font-medium" scope="col">
                Nome
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                E-mail
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                Telefone
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => renderUserRow(item, idx))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {items.map((item) => {
          const selected = selectedUserId === item.id
          return (
            <li
              key={item.id}
              className={cn(
                "rounded-lg border bg-card p-4 shadow-sm transition-colors",
                selected && "border-primary bg-primary/5"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.userName}</p>
                  <p
                    className="mt-2 truncate text-xs text-muted-foreground"
                    title={item.userEmail}
                  >
                    {item.userEmail}
                  </p>
                  <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                    {formatPhone(item.userPhone)}
                  </p>
                </div>
                <input
                  type="radio"
                  name="link-user-mobile"
                  checked={selected}
                  onChange={() => onSelectUser(item.id)}
                  aria-label={`Selecionar ${item.userName}`}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
              </div>
            </li>
          )
        })}
      </ul>

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
              {pageSizeOptions.map((n) => (
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
            <ChevronsLeft className="size-4" aria-hidden />
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
            <ChevronLeft className="size-4" aria-hidden />
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
            <ChevronRight className="size-4" aria-hidden />
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
            <ChevronsRight className="size-4" aria-hidden />
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
    </div>
  )
}
