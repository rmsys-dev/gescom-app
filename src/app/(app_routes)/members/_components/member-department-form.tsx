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
import { useOperatorPermissions } from "@/lib/permissions"
import { useDepartmentsQuery } from "@/modules/departments/use-departments"
import { useAddMemberDepartmentMutation } from "@/modules/memberships/use-members"

type MemberDepartmentFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  memberId: string
  existingDepartmentIds: string[]
  makeMainDepartment: boolean
}

export function MemberDepartmentForm({
  open,
  onOpenChange,
  enterpriseId,
  memberId,
  existingDepartmentIds,
  makeMainDepartment,
}: MemberDepartmentFormProps) {
  const addMutation = useAddMemberDepartmentMutation(enterpriseId, memberId)
  const perms = useOperatorPermissions()
  const catalogQuery = useDepartmentsQuery(open && perms.canConsultDepartments)

  const [departmentId, setDepartmentId] = useState("")

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDepartmentId("")
    }
    onOpenChange(nextOpen)
  }

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
    if (catalogQuery.isPending || catalogQuery.error) {
      toast.error("Não foi possível carregar o catálogo de departamentos.")
      return
    }
    if (!departmentId) {
      toast.error("Selecione um departamento.")
      return
    }

    try {
      await addMutation.mutateAsync({
        departmentId,
        mainDepartment: makeMainDepartment,
      })
      handleOpenChange(false)
    } catch {
      // Erros de API são tratados pelo QueryClient global
    }
  }

  const isPending = addMutation.isPending
  const isCatalogBlocked =
    !perms.canConsultDepartments ||
    catalogQuery.isPending ||
    !!catalogQuery.error

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Adicionar departamento</SheetTitle>
          <SheetDescription>
            Vincule o membro a um departamento da empresa.
            {makeMainDepartment
              ? " Será definido como departamento principal."
              : " O departamento principal não pode ser alterado após a criação."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6">
          <FieldGroup>
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
                  Sem permissão para consultar departamentos.
                </p>
              )}
              {perms.canConsultDepartments && catalogQuery.error && (
                <p className="mt-1 text-xs text-destructive">
                  Não foi possível carregar o catálogo de departamentos.
                </p>
              )}
            </Field>
            <Button
              type="submit"
              disabled={isPending || isCatalogBlocked}
              tooltip="Salvar"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  )
}
