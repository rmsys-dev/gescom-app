"use client"

import { useMemo, useState } from "react"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
} from "lucide-react"

import { MemberDetailDialog } from "@/app/(app_routes)/members/_components/member-detail-dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MemberClassBadge } from "@/app/(app_routes)/members/_components/member-class-badge"
import { MemberStatusBadge } from "@/app/(app_routes)/members/_components/member-status-badge"
import { MemberActionsMenu } from "@/app/(app_routes)/members/_components/member-actions-menu"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
import type { MemberListItem } from "@/modules/memberships/memberships.schema"
import { formatCpfCnpj, formatPhone } from "@/lib/formatters"
import { cn } from "@/lib/utils"

type SortKey = "name" | "registration" | "email" | "phone" | "status"
type SortDir = "asc" | "desc"
type SortState = { key: SortKey; dir: SortDir } | null

type MembersTableProps = {
  items: MemberListItem[]
  total: number
  limit: number
  offset: number
  basePath: string
  config: MembershipRouteConfig
  showClassColumn?: boolean
  emptyTitle: string
  emptyHint: string
  onPageChange: (offset: number) => void
  onLimitChange?: (limit: number) => void
  onClearFilters?: () => void
}

const PAGE_SIZE_OPTIONS = [20, 50, 100]

function SortIndicator({
  column,
  sort,
}: {
  column: SortKey
  sort: SortState
}) {
  if (!sort || sort.key !== column) {
    return (
      <ArrowUpDown
        className="ml-1 inline size-3 shrink-0 opacity-35"
        aria-hidden
      />
    )
  }
  return (
    <span className="ml-1 inline text-[10px] font-bold" aria-hidden>
      {sort.dir === "asc" ? "↑" : "↓"}
    </span>
  )
}

function SortableTh({
  column,
  sort,
  onSort,
  children,
  className,
}: {
  column: SortKey
  sort: SortState
  onSort: (key: SortKey) => void
  children: React.ReactNode
  className?: string
}) {
  const isActive = sort?.key === column
  const ariaSortValue =
    isActive ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"

  return (
    <th
      scope="col"
      className={cn(
        "cursor-pointer select-none px-4 py-3 text-left font-medium transition-colors hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground",
        className
      )}
      onClick={() => onSort(column)}
      aria-sort={ariaSortValue}
    >
      {children}
      <SortIndicator column={column} sort={sort} />
    </th>
  )
}

export function MembersTable({
  items,
  total,
  limit,
  offset,
  basePath,
  config,
  showClassColumn = true,
  emptyTitle,
  emptyHint,
  onPageChange,
  onLimitChange,
  onClearFilters,
}: MembersTableProps) {
  const [sort, setSort] = useState<SortState>(null)
  const [viewMemberId, setViewMemberId] = useState<string | null>(null)

  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = offset > 0
  const canNext = offset + limit < total

  const sortedItems = useMemo(() => {
    if (!sort) return items
    return [...items].sort((a, b) => {
      let valA = ""
      let valB = ""
      switch (sort.key) {
        case "name":
          valA = a.user.userName
          valB = b.user.userName
          break
        case "registration":
          valA = a.user.userRegistration
          valB = b.user.userRegistration
          break
        case "email":
          valA = a.user.userEmail
          valB = b.user.userEmail
          break
        case "phone":
          valA = a.user.userPhone
          valB = b.user.userPhone
          break
        case "status":
          valA = a.status
          valB = b.status
          break
      }
      const cmp = valA.localeCompare(valB, "pt-BR")
      return sort.dir === "asc" ? cmp : -cmp
    })
  }, [items, sort])

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" }
      if (prev.dir === "asc") return { key, dir: "desc" }
      return null
    })
  }

  function openMemberView(memberId: string) {
    setViewMemberId(memberId)
  }

  const pageNumbers = useMemo(() => {
    const total5 = Math.min(5, totalPages)
    let start: number
    if (totalPages <= 5) {
      start = 1
    } else if (page <= 3) {
      start = 1
    } else if (page >= totalPages - 2) {
      start = totalPages - 4
    } else {
      start = page - 2
    }
    return Array.from({ length: total5 }, (_, i) => start + i)
  }, [page, totalPages])

  const listLabel = `Lista de ${config.labels.plural}`

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
    <div className="space-y-3">
      <div className="hidden overflow-hidden border md:block">
        <table className="w-full text-sm" aria-label={listLabel}>
          <thead className="border-b bg-muted/40 text-xs">
            <tr>
              <SortableTh column="name" sort={sort} onSort={toggleSort}>
                Nome
              </SortableTh>
              <SortableTh
                column="registration"
                sort={sort}
                onSort={toggleSort}
              >
                CPF/CNPJ
              </SortableTh>
              <SortableTh column="email" sort={sort} onSort={toggleSort}>
                E-mail
              </SortableTh>
              <SortableTh column="phone" sort={sort} onSort={toggleSort}>
                Telefone
              </SortableTh>
              {showClassColumn && (
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"
                >
                  Classe
                </th>
              )}
              <SortableTh column="status" sort={sort} onSort={toggleSort}>
                Status
              </SortableTh>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, idx) => (
              <tr
                key={item.id}
                onClick={() => openMemberView(item.id)}
                className={cn(
                  "cursor-pointer border-b transition-colors last:border-0",
                  "hover:bg-primary/5 focus-within:bg-primary/5",
                  idx % 2 === 1 && "bg-muted/20"
                )}
                tabIndex={0}
                role="row"
                aria-label={`Ver detalhes de ${item.user.userName}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    openMemberView(item.id)
                  }
                }}
              >
                <td className="px-4 py-3 font-medium">
                  {item.user.userName}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">
                  {formatCpfCnpj(item.user.userRegistration)}
                </td>
                <td className="max-w-[200px] px-4 py-3">
                  <span
                    className="block truncate text-muted-foreground"
                    title={item.user.userEmail}
                  >
                    {item.user.userEmail}
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {formatPhone(item.user.userPhone)}
                </td>
                {showClassColumn && (
                  <td className="px-4 py-3">
                    <MemberClassBadge memberClass={item.class} />
                  </td>
                )}
                <td className="px-4 py-3">
                  <MemberStatusBadge status={item.status} />
                </td>
                <td
                  className="px-4 py-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MemberActionsMenu
                    memberId={item.id}
                    basePath={basePath}
                    onView={() => openMemberView(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={listLabel}>
        {sortedItems.map((item) => (
          <li
            key={item.id}
            className="border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{item.user.userName}</p>
                <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                  {formatCpfCnpj(item.user.userRegistration)}
                </p>
              </div>
              <MemberStatusBadge status={item.status} />
            </div>
            <p
              className="mt-2 truncate text-xs text-muted-foreground"
              title={item.user.userEmail}
            >
              {item.user.userEmail}
            </p>
            <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
              {formatPhone(item.user.userPhone)}
            </p>
            {showClassColumn && (
              <div className="mt-2">
                <MemberClassBadge memberClass={item.class} />
              </div>
            )}
            <Button
              type="button"
              className="mt-3 w-full"
              variant="outline"
              size="sm"
              onClick={() => openMemberView(item.id)}
            >
              Visualizar
            </Button>
          </li>
        ))}
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
              {PAGE_SIZE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1" role="navigation" aria-label="Paginação">
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

      {viewMemberId && (
        <MemberDetailDialog
          memberId={viewMemberId}
          config={config}
          open={viewMemberId !== null}
          onOpenChange={(open) => {
            if (!open) setViewMemberId(null)
          }}
        />
      )}
    </div>
  )
}
