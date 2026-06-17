"use client"

import { useMemo, useState } from "react"
import { Layers, Trash2 } from "lucide-react"

import { EnterprisePermissionBadge } from "@/app/(app_routes)/enterprise/_components/enterprise-permission-badge"
import { MemberStatusBadge } from "@/app/(app_routes)/members/_components/member-status-badge"
import { Button } from "@/components/ui/button"
import type { MemberDepartment } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPermissionEntry } from "@/modules/memberships/member-department-permissions"
import {
  useUpdateMemberExtraPermissionMutation,
  useUpdateMemberPermissionDefaultMutation,
} from "@/modules/memberships/use-members"

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
  const [pendingPermission, setPendingPermission] = useState<string | null>(
    null
  )

  const activeCount = useMemo(
    () => permissions.filter((entry) => entry.status === "ALLOW").length,
    [permissions]
  )
  const inactiveCount = permissions.length - activeCount

  async function handleToggle(
    entry: MemberDepartmentPermissionEntry,
    checked: boolean
  ) {
    if (!canAlterPermissions) return

    const mutation =
      entry.kind === "extra" ? extraMutation : defaultMutation
    setPendingPermission(entry.permission)

    try {
      await mutation.mutateAsync({
        departmentId: department.departmentId,
        input: {
          permission: entry.permission,
          status: checked ? "ALLOW" : "DENIED",
        },
      })
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    } finally {
      setPendingPermission(null)
    }
  }

  return (
    <div className="overflow-hidden -lg border border-border/60 bg-muted/20 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-background/50 px-4 py-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Layers className="size-4 shrink-0 text-primary" aria-hidden />
            <p className="font-medium">{departmentName}</p>
            {department.mainDepartment && (
              <span className="bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Departamento principal
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MemberStatusBadge status={department.status} />
          {canAlter && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onDelete}
              tooltip="Remover departamento"
              aria-label="Remover departamento"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            Permissões ({permissions.length})
          </div>
          {permissions.length > 0 && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {activeCount} ativas
              </span>
              {" · "}
              <span className="font-medium text-red-600 dark:text-red-400">
                {inactiveCount} bloqueadas
              </span>
            </p>
          )}
        </div>

        {permissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma permissão neste vínculo.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {permissions.map((entry) => {
              const isActive = entry.status === "ALLOW"
              return (
                <li key={`${department.id}-${entry.permission}-${entry.kind}`}>
                  <EnterprisePermissionBadge
                    permission={entry.permission}
                    active={isActive}
                    disabled={!canAlterPermissions}
                    pending={pendingPermission === entry.permission}
                    onCheckedChange={
                      canAlterPermissions
                        ? (checked) => void handleToggle(entry, checked)
                        : undefined
                    }
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
    </div>
  )
}
