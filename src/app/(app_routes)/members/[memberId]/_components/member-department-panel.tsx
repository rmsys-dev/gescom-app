"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Layers, Search, Trash2 } from "lucide-react"

import { EnterprisePermissionBadge } from "@/app/(app_routes)/enterprise/_components/enterprise-permission-badge"
import { MemberDepartmentPermissionSearchDialog } from "@/app/(app_routes)/members/[memberId]/_components/member-department-permission-search-dialog"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { MemberDepartment } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPermissionEntry } from "@/modules/memberships/member-department-permissions"
import {
  useUpdateMemberExtraPermissionMutation,
  useUpdateMemberPermissionDefaultMutation,
} from "@/modules/memberships/use-members"
import { StatusBadge } from "@/components/global/returns/status-badge"
import { Separator } from "@/components/ui/separator"

type PermissionStatus = "ALLOW" | "DENIED"

function permissionKey(entry: MemberDepartmentPermissionEntry) {
  return `${entry.permission}-${entry.kind}`
}

export function MemberDepartmentPanel({
  department,
  departmentName,
  permissions,
  enterpriseId,
  memberId,
  canAlter,
  canAlterPermissions,
  onDelete,
}: {
  department: MemberDepartment
  departmentName: string
  permissions: MemberDepartmentPermissionEntry[]
  enterpriseId: string
  memberId: string
  canAlter: boolean
  canAlterPermissions: boolean
  onDelete: () => void
}) {
  const defaultMutation = useUpdateMemberPermissionDefaultMutation(
    enterpriseId,
    memberId
  )
  const extraMutation = useUpdateMemberExtraPermissionMutation(
    enterpriseId,
    memberId
  )
  const [optimisticStatus, setOptimisticStatus] = useState<
    Record<string, PermissionStatus>
  >({})
  const [searchOpen, setSearchOpen] = useState(false)

  const activeCount = useMemo(
    () =>
      permissions.filter(
        (entry) => resolveStatus(entry, optimisticStatus) === "ALLOW"
      ).length,
    [permissions, optimisticStatus]
  )
  const inactiveCount = permissions.length - activeCount

  async function handleToggle(
    entry: MemberDepartmentPermissionEntry,
    checked: boolean
  ) {
    if (!canAlterPermissions) return

    const key = permissionKey(entry)
    const nextStatus: PermissionStatus = checked ? "ALLOW" : "DENIED"
    const mutation = entry.kind === "extra" ? extraMutation : defaultMutation

    setOptimisticStatus((current) => ({ ...current, [key]: nextStatus }))

    try {
      await mutation.mutateAsync({
        departmentId: department.departmentId,
        input: {
          permission: entry.permission,
          status: nextStatus,
        },
      })
      setOptimisticStatus((current) => {
        const next = { ...current }
        delete next[key]
        return next
      })
    } catch {
      setOptimisticStatus((current) => {
        const next = { ...current }
        delete next[key]
        return next
      })
    }
  }

  function getIsActive(entry: MemberDepartmentPermissionEntry) {
    return resolveStatus(entry, optimisticStatus) === "ALLOW"
  }

  async function handleToggleFromSearch(entry: MemberDepartmentPermissionEntry) {
    await handleToggle(entry, !getIsActive(entry))
  }

  const isTogglePending = defaultMutation.isPending || extraMutation.isPending

  return (
    <Collapsible
      defaultOpen={false}
      className="overflow-hidden rounded-lg border border-border/60 bg-muted/20 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <CollapsibleTrigger className="group/trigger flex min-w-0 flex-1 items-center gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <ChevronDown
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-in-out group-data-[state=open]/trigger:rotate-180"
            aria-hidden
          />
          <Layers className="size-4 shrink-0 text-primary" aria-hidden />
          <p className="min-w-0 truncate font-medium">{departmentName}</p>
          {department.mainDepartment && (
            <span className="inline-flex items-center border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Departamento principal
            </span>
          )}
          <StatusBadge status={department.status} />
        </CollapsibleTrigger>
        <div className="flex items-center">
          {permissions.length > 0 && (
            <div className="flex items-center border-r border-border px-2 py-1">
              <p className="text-xs whitespace-nowrap text-muted-foreground">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {activeCount} permissões ativas
                </span>
                {" • "}
                <span className="font-medium text-red-600 dark:text-red-400">
                  {inactiveCount} permissões bloqueadas
                </span>
              </p>
            </div>
          )}
          <Separator orientation="vertical" className="h-full" />
          {permissions.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setSearchOpen(true)}
              tooltip="Pesquisar permissão"
              aria-label="Pesquisar permissão"
            >
              <Search className="size-4" />
            </Button>
          )}
          {canAlter && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-destructive"
              onClick={onDelete}
              tooltip="Remover departamento"
              aria-label="Remover departamento"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>

      <CollapsibleContent>
        <div className="space-y-3 px-4 py-4">
          {permissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma permissão neste vínculo.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {permissions.map((entry) => {
                const isActive = resolveStatus(entry, optimisticStatus) === "ALLOW"
                return (
                  <li key={`${department.id}-${entry.permission}-${entry.kind}`}>
                    <EnterprisePermissionBadge
                      permission={entry.permission}
                      active={isActive}
                      disabled={!canAlterPermissions}
                      onCheckedChange={
                        canAlterPermissions
                          ? (checked) => void handleToggle(entry, checked)
                          : undefined
                      }
                      isDialog={false}
                    />
                  </li>
                )
              })}
            </ul>
          )}

          {!canAlterPermissions && permissions.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Sem permissão para gerenciar permissões.
            </p>
          )}
        </div>
      </CollapsibleContent>

      <MemberDepartmentPermissionSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        departmentName={departmentName}
        permissions={permissions}
        canAlterPermissions={canAlterPermissions}
        getIsActive={getIsActive}
        onTogglePermission={handleToggleFromSearch}
        isTogglePending={isTogglePending}
      />
    </Collapsible>
  )
}

function resolveStatus(
  entry: MemberDepartmentPermissionEntry,
  optimisticStatus: Record<string, PermissionStatus>
) {
  const override = optimisticStatus[permissionKey(entry)]
  if (override !== undefined && override !== entry.status) {
    return override
  }
  return entry.status
}
