"use client"

import { useEffect, useMemo, useState } from "react"
import { Building2, Plus } from "lucide-react"

import { MemberDepartmentForm } from "@/app/(app_routes)/members/_components/member-department-form"
import { MemberDepartmentPanel } from "@/app/(app_routes)/members/_components/member-department-panel"
import { ConfirmSoftDeleteDialog } from "@/components/global/confirm-soft-delete-dialog"
import {
  SectionToggle,
  SectionTogglePanel,
  type SectionToggleOption,
} from "@/components/global/section-toggle"
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

  const [selectedDepartmentId, setSelectedDepartmentId] = useState("")
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

  useEffect(() => {
    if (activeDepartments.length === 0) {
      setTimeout(() => {
        setSelectedDepartmentId("")
      }, 0)
      return
    }

    if (
      !activeDepartments.some(
        (department) => department.id === selectedDepartmentId
      )
    ) {
      setTimeout(() => {
        setSelectedDepartmentId(activeDepartments[0]!.id)
      }, 0)
    }
  }, [activeDepartments, selectedDepartmentId])

  const effectiveSelectedId =
    selectedDepartmentId || activeDepartments[0]?.id || ""

  const toggleOptions: SectionToggleOption<string>[] = activeDepartments.map(
    (department) => ({
      id: department.id,
      label: resolveDepartmentName(department, departmentNameById),
    })
  )

  const selectedDepartment =
    activeDepartments.find(
      (department) => department.id === effectiveSelectedId
    ) ?? activeDepartments[0]

  const departmentPermissions = useMemo(
    () =>
      selectedDepartment
        ? mapMemberDepartmentPermissionEntries(selectedDepartment)
        : [],
    [selectedDepartment]
  )

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
            Vínculos departamentais e permissões por departamento. Use o switch
            para ativar ou desativar cada permissão.
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
          <>
            {activeDepartments.length > 1 && (
              <SectionToggle
                value={effectiveSelectedId}
                onValueChange={setSelectedDepartmentId}
                options={toggleOptions}
                ariaLabel="Departamentos do membro"
                idPrefix="member-department"
              />
            )}

            {selectedDepartment && (
              <SectionTogglePanel
                sectionId={selectedDepartment.id}
                idPrefix="member-department"
              >
                <MemberDepartmentPanel
                  department={selectedDepartment}
                  departmentName={resolveDepartmentName(
                    selectedDepartment,
                    departmentNameById
                  )}
                  permissions={departmentPermissions}
                  enterpriseId={enterpriseId}
                  memberId={member.id}
                  canAlter={canAlter}
                  canAlterPermissions={canAlterPermissions}
                  onDelete={() => setDeleteTarget(selectedDepartment)}
                />
              </SectionTogglePanel>
            )}
          </>
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
