"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPayload } from "@/modules/memberships/memberships.schema"
import { useOperatorPermissions } from "@/lib/permissions"
import { useDepartmentsQuery } from "@/modules/departments/use-departments"
import { isClienteClass } from "@/modules/memberships/memberships-rules"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type DepartmentOption = {
  departmentId: string
  name: string
}

type MemberDepartmentsPickerProps = {
  memberClass: EnterpriseMemberClass
  departments: MemberDepartmentPayload[]
  onChange: (departments: MemberDepartmentPayload[]) => void
}

export function MemberDepartmentsPicker({
  memberClass,
  departments,
  onChange,
}: MemberDepartmentsPickerProps) {
  const [selectedId, setSelectedId] = useState("")
  const perms = useOperatorPermissions()
  const catalogQuery = useDepartmentsQuery(
    !isClienteClass(memberClass) && perms.canConsultDepartments
  )

  if (isClienteClass(memberClass)) {
    return (
      <FieldDescription>
        Clientes não possuem departamentos no vinculo.
      </FieldDescription>
    )
  }

  const options: DepartmentOption[] =
    catalogQuery.data?.map((d) => ({ departmentId: d.id, name: d.name })) ?? []

  function addDepartment() {
    if (!selectedId) return
    if (departments.some((d) => d.departmentId === selectedId)) return
    const isFirst = departments.length === 0
    onChange([
      ...departments,
      { departmentId: selectedId, mainDepartment: isFirst },
    ])
    setSelectedId("")
  }

  function removeDepartment(departmentId: string) {
    const next = departments.filter((d) => d.departmentId !== departmentId)
    if (next.length > 0 && !next.some((d) => d.mainDepartment)) {
      next[0] = { ...next[0]!, mainDepartment: true }
    }
    onChange(next)
  }

  function setMain(departmentId: string) {
    onChange(
      departments.map((d) => ({
        ...d,
        mainDepartment: d.departmentId === departmentId,
      }))
    )
  }

  const available = options.filter(
    (o) => !departments.some((d) => d.departmentId === o.departmentId)
  )

  return (
    <div className="space-y-4">
      {/* <FieldDescription>
        Selecione ao menos um departamento do catalogo e marque o principal.
      </FieldDescription> */}
      {!perms.canConsultDepartments && (
        <p className="text-xs text-destructive">
          Sem permissao para consultar departamentos.
        </p>
      )}
      {perms.canConsultDepartments && catalogQuery.error && (
        <p className="text-xs text-destructive">
          Nao foi possivel carregar o catalogo de departamentos.
        </p>
      )}

      {departments.length > 0 && (
        <ul className="space-y-2">
          {departments.map((d) => {
            const label =
              options.find((o) => o.departmentId === d.departmentId)?.name ??
              d.departmentId
            return (
              <li
                key={d.departmentId}
                className="flex flex-wrap items-center gap-2 border border-border/60 bg-muted/20 px-3 py-2"
              >
                <span className="min-w-0 flex-1 text-sm font-medium">
                  {label}
                </span>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 bg-foreground/10 px-2 py-1 text-xs transition-colors",
                    d.mainDepartment && "bg-primary/15 text-primary"
                  )}
                >
                  <input
                    type="radio"
                    name="mainDepartment"
                    checked={d.mainDepartment}
                    onChange={() => setMain(d.departmentId)}
                    className="peer sr-only"
                    aria-label={`Departamento principal: ${label}`}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "relative inline-flex size-3.5 shrink-0 border-2 border-muted-foreground/50 bg-background transition-[border-color,box-shadow]",
                      "after:absolute after:top-1/2 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-primary after:opacity-0 after:transition-opacity after:content-['']",
                      "peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50 peer-focus-visible:ring-offset-1",
                      "peer-checked:border-primary peer-checked:after:opacity-100"
                    )}
                  />
                  Principal
                </label>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  variant="destructive"
                  size="xs"
                  onClick={() => removeDepartment(d.departmentId)}
                  tooltip="Remover departamento"
                >
                  Remover
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Field className="min-w-0 flex-1">
          <FieldLabel>Selecione ao menos um departamento</FieldLabel>
          <Select
            value={selectedId}
            onValueChange={setSelectedId}
            disabled={
              !perms.canConsultDepartments ||
              catalogQuery.isPending ||
              !!catalogQuery.error
            }
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
        </Field>
        <Button
          type="button"
          variant="secondary"
          disabled={
            !selectedId ||
            !perms.canConsultDepartments ||
            catalogQuery.isPending ||
            !!catalogQuery.error
          }
          onClick={addDepartment}
          tooltip="Adicionar departamento"
        >
          Adicionar
        </Button>
      </div>
    </div>
  )
}
