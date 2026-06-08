"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { HttpError } from "@/lib/api/http-error"
import { useOperatorPermissions } from "@/lib/permissions"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import { useDepartmentsQuery } from "@/modules/departments/use-departments"
import type { MemberDepartment } from "@/modules/memberships/memberships.schema"
import {
  useAddMemberDepartmentMutation,
  useUpdateMemberDepartmentMutation,
} from "@/modules/memberships/use-members"

type MemberDepartmentFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  memberId: string
  existingDepartmentIds: string[]
  editing?: MemberDepartment | null
}

export function MemberDepartmentForm({
  open,
  onOpenChange,
  enterpriseId,
  memberId,
  existingDepartmentIds,
  editing = null,
}: MemberDepartmentFormProps) {
  const addMutation = useAddMemberDepartmentMutation(enterpriseId, memberId)
  const updateMutation = useUpdateMemberDepartmentMutation(
    enterpriseId,
    memberId
  )
  const perms = useOperatorPermissions()
  const catalogQuery = useDepartmentsQuery(
    open && !editing && perms.canConsultDepartments
  )

  const [departmentId, setDepartmentId] = useState(
    editing?.departmentId ?? ""
  )
  const [mainDepartment, setMainDepartment] = useState(
    editing?.mainDepartment ?? false
  )

  const catalogOptions =
    catalogQuery.data?.map((d) => ({
      departmentId: d.id,
      name: d.name,
    })) ?? []

  const available = catalogOptions.filter(
    (o) => !existingDepartmentIds.includes(o.departmentId)
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editing && (catalogQuery.isPending || catalogQuery.error)) {
      toast.error("Nao foi possivel carregar o catalogo de departamentos.")
      return
    }
    if (!departmentId && !editing) {
      toast.error("Selecione um departamento.")
      return
    }

    try {
      if (editing) {
        await updateMutation.mutateAsync({
          memberDepartmentId: editing.id,
          input: {
            departmentId: departmentId || editing.departmentId,
            mainDepartment,
          },
        })
      } else {
        await addMutation.mutateAsync({
          departmentId,
          mainDepartment,
        })
      }
      onOpenChange(false)
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(
          error,
          editing
            ? "Nao foi possivel atualizar o departamento."
            : "Nao foi possivel adicionar o departamento."
        )
        return
      }
      toast.error("Operacao falhou.")
    }
  }

  const isPending = addMutation.isPending || updateMutation.isPending
  const isCatalogBlocked =
    !editing &&
    (!perms.canConsultDepartments ||
      catalogQuery.isPending ||
      !!catalogQuery.error)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {editing ? "Editar departamento" : "Adicionar departamento"}
          </SheetTitle>
          <SheetDescription>
            Vinculo membro-departamento (memberDepartmentId no detalhe).
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6">
          <FieldGroup>
            {!editing && (
              <Field>
                <FieldLabel>Departamento</FieldLabel>
                <Select
                  value={departmentId}
                  onValueChange={setDepartmentId}
                  disabled={isCatalogBlocked || isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        catalogQuery.isPending
                          ? "A carregar..."
                          : catalogQuery.error
                            ? "Falha ao carregar"
                            : "Selecione..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {available.map((o) => (
                      <SelectItem key={o.departmentId} value={o.departmentId}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!perms.canConsultDepartments && (
                  <p className="mt-1 text-xs text-destructive">
                    Sem permissao para consultar departamentos.
                  </p>
                )}
                {perms.canConsultDepartments && catalogQuery.error && (
                  <p className="mt-1 text-xs text-destructive">
                    Nao foi possivel carregar o catalogo de departamentos.
                  </p>
                )}
              </Field>
            )}
            {editing && (
              <Field>
                <FieldLabel>departmentId</FieldLabel>
                <p className="font-mono text-xs text-muted-foreground">
                  {editing.departmentId}
                </p>
              </Field>
            )}
            <Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={mainDepartment}
                  onChange={(e) => setMainDepartment(e.target.checked)}
                />
                Departamento principal
              </label>
            </Field>
            <Button
              type="submit"
              disabled={isPending || isCatalogBlocked}
              tooltip="Guardar"
            >
              {isPending ? "A guardar..." : "Guardar"}
            </Button>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  )
}
