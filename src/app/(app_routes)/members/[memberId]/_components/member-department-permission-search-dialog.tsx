"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { EnterprisePermissionBadge } from "@/app/(app_routes)/enterprise/_components/enterprise-permission-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { MemberDepartmentPermissionEntry } from "@/modules/memberships/member-department-permissions"
import { filterMemberDepartmentPermissions } from "@/modules/memberships/member-department-permissions"
import { cn } from "@/lib/utils"

type MemberDepartmentPermissionSearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  departmentName: string
  permissions: MemberDepartmentPermissionEntry[]
  canAlterPermissions: boolean
  getIsActive: (entry: MemberDepartmentPermissionEntry) => boolean
  onTogglePermission: (entry: MemberDepartmentPermissionEntry) => Promise<void>
  isTogglePending: boolean
}

export function MemberDepartmentPermissionSearchDialog({
  open,
  onOpenChange,
  departmentName,
  permissions,
  canAlterPermissions,
  getIsActive,
  onTogglePermission,
  isTogglePending,
}: MemberDepartmentPermissionSearchDialogProps) {
  const [query, setQuery] = useState("")

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setQuery("")
    onOpenChange(nextOpen)
  }

  const matches = useMemo(
    () => filterMemberDepartmentPermissions(permissions, query),
    [permissions, query]
  )

  const hasQuery = query.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-8xl">
        <DialogHeader>
          <DialogTitle>Pesquisar permissão</DialogTitle>
          <DialogDescription>
            Busque uma permissão no departamento {departmentName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nome ou código da permissão"
              aria-label="Pesquisar permissão"
              className="pl-8"
              autoFocus
            />
          </div>

          {!hasQuery ? (
            <p className="text-sm text-muted-foreground">
              Digite para localizar uma permissão neste departamento.
            </p>
          ) : matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma permissão encontrada para &quot;{query.trim()}&quot;.
            </p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-6 gap-2 scrollbar-minimal max-h-80 space-y-3 overflow-y-auto pr-1">
              {matches.map((entry) => {
                const isActive = getIsActive(entry)
                return (
                  <li
                    key={`${entry.permission}-${entry.kind}`}
                    className="space-y-2 rounded-lg border border-dashed border-primary/40 bg-background/10 p-3"
                  >
                    <EnterprisePermissionBadge
                      permission={entry.permission}
                      active={isActive}
                      isDialog={true}
                    />
                    {canAlterPermissions ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full border-none hover:bg-transparent dark:hover:bg-transparent",
                          isActive && " text-red-400 dark:text-red-400 hover:font-black",
                          !isActive && "text-emerald-400 dark:text-emerald-400 hover:font-black"
                        )}
                        disabled={isTogglePending}
                        onClick={() => void onTogglePermission(entry)}
                      >
                        {isTogglePending
                          ? "Processando..."
                          : isActive
                            ? "Desativar"
                            : "Ativar"}
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Sem permissão para alterar permissões.
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
