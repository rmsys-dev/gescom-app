"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MemberClassBadge } from "@/app/(app_routes)/members/_components/member-class-badge"
import { MemberStatusBadge } from "@/app/(app_routes)/members/_components/member-status-badge"
import type { MemberListItem } from "@/modules/memberships/memberships.schema"
import { formatCpfCnpj, formatPhone } from "@/lib/formatters"

type MembersTableProps = {
  items: MemberListItem[]
  total: number
  limit: number
  offset: number
  basePath: string
  showClassColumn?: boolean
  emptyTitle: string
  emptyHint: string
  onPageChange: (offset: number) => void
}

export function MembersTable({
  items,
  total,
  limit,
  offset,
  basePath,
  showClassColumn = true,
  emptyTitle,
  emptyHint,
  onPageChange,
}: MembersTableProps) {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = offset > 0
  const canNext = offset + limit < total

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card px-6 py-12 text-center">
        <p className="font-medium text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">CPF/CNPJ</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Telefone</th>
              {showClassColumn && (
                <th className="px-4 py-3 font-medium">Classe</th>
              )}
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="p-4 font-medium">{item.user.userName}</td>
                <td className="p-4 font-mono">
                  {formatCpfCnpj(item.user.userRegistration)}
                </td>
                <td className="max-w-[200px] truncate p-4">
                  {item.user.userEmail}
                </td>
                <td className="p-4">{formatPhone(item.user.userPhone)}</td>
                {showClassColumn && (
                  <td className="p-4">
                    <MemberClassBadge memberClass={item.class} />
                  </td>
                )}
                <td className="p-4">
                  <MemberStatusBadge status={item.status} />
                </td>
                <td className="p-4 text-right">
                  <Button asChild variant="ghost" size="sm" tooltip="Ver detalhe">
                    <Link href={`${basePath}/${item.id}`}>
                      <Eye className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{item.user.userName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.user.userEmail}
                </p>
              </div>
              <MemberStatusBadge status={item.status} />
            </div>
            {showClassColumn && (
              <div className="mt-2 flex flex-wrap gap-2">
                <MemberClassBadge memberClass={item.class} />
              </div>
            )}
            <Button asChild className="mt-3 w-full" variant="outline" size="sm">
              <Link href={`${basePath}/${item.id}`}>Ver detalhe</Link>
            </Button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          Pagina {page} de {totalPages} ({total} registos)
        </span>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canPrev}
            onClick={() => onPageChange(Math.max(0, offset - limit))}
            tooltip="Pagina anterior"
            aria-label="Pagina anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canNext}
            onClick={() => onPageChange(offset + limit)}
            tooltip="Proxima pagina"
            aria-label="Proxima pagina"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
