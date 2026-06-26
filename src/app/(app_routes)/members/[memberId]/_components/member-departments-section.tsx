"use client"

import { useMemo, useState } from "react"
import { Building2, Plus } from "lucide-react"

import { MemberDepartmentForm } from "@/app/(app_routes)/members/[memberId]/_components/member-department-form"
import { MemberDepartmentPanel } from "@/app/(app_routes)/members/[memberId]/_components/member-department-panel"
import { ConfirmSoftDeleteDialog } from "@/components/global/dialogs/confirm-soft-delete-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useOperatorPermissions } from "@/lib/permissions"
import { useDepartmentsQuery } from "@/modules/departments/use-departments"
import type { MemberDepartment, MemberDetail } from "@/modules/memberships/memberships.schema"
import { mapMemberDepartmentPermissionEntries } from "@/modules/memberships/member-department-permissions"
import { useUpdateMemberDepartmentMutation } from "@/modules/memberships/use-members"

function resolveDepartmentName(
  department: MemberDepartment,
  departmentNameById: Map<string, string>
) {
  return (
    department.name?.trim() ||
    departmentNameById.get(department.departmentId) ||
    department.departmentId
  )
}

export function MemberDepartmentsSection({
  enterpriseId,
  member,
  canAlter,
  canAlterPermissions,
}: {
  enterpriseId: string
  member: MemberDetail
  canAlter: boolean
  canAlterPermissions: boolean
}) {
  const perms = useOperatorPermissions()
  const catalogQuery = useDepartmentsQuery(perms.canConsultDepartments)

  const departmentNameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const d of catalogQuery.data ?? []) {
      map.set(d.id, d.name)
    }
    return map
  }, [catalogQuery.data])

  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MemberDepartment | null>(
    null
  )

  const deleteMutation = useUpdateMemberDepartmentMutation(
    enterpriseId,
    member.id
  )

  const activeDepartments = member.departments.filter(
    (d) => d.status === "ATIVO"
  )
  const existingIds = member.departments.map((d) => d.departmentId)

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync({
        memberDepartmentId: deleteTarget.id,
        input: { softDelete: true },
      })
      setDeleteTarget(null)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-md">
            <Building2 className="size-4 text-primary" aria-hidden />
            Departamentos e permissões
          </CardTitle>
          <CardDescription>
            Vínculos departamentais e permissões por departamento. Expanda cada
            bloco para ver e alternar as permissões.
          </CardDescription>
        </div>
        {canAlter && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setFormOpen(true)}
            tooltip="Adicionar departamento"
          >
            <Plus className="size-4" aria-hidden />
            Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {activeDepartments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum departamento ativo.
          </p>
        ) : (
          <div className="space-y-3">
            {activeDepartments.map((department) => (
              <MemberDepartmentPanel
                key={department.id}
                department={department}
                departmentName={resolveDepartmentName(
                  department,
                  departmentNameById
                )}
                permissions={mapMemberDepartmentPermissionEntries(department)}
                enterpriseId={enterpriseId}
                memberId={member.id}
                canAlter={canAlter}
                canAlterPermissions={canAlterPermissions}
                onDelete={() => setDeleteTarget(department)}
              />
            ))}
          </div>
        )}
      </CardContent>

      {canAlter && (
        <MemberDepartmentForm
          open={formOpen}
          onOpenChange={setFormOpen}
          enterpriseId={enterpriseId}
          memberId={member.id}
          existingDepartmentIds={existingIds}
          makeMainDepartment={activeDepartments.length === 0}
        />
      )}

      <ConfirmSoftDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remover departamento?"
        description="O vínculo com este departamento será inativado."
        confirmLabel="Remover"
        isPending={deleteMutation.isPending}
        onConfirm={() => void confirmDelete()}
      />
    </Card>
  )
}
