"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { HttpError } from "@/lib/api/http-error"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import { MemberDepartmentsPicker } from "@/app/(app_routes)/members/_components/member-departments-picker"
import { MEMBER_CLASS_OPTIONS } from "@/modules/memberships/member-class-label"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPayload } from "@/modules/memberships/memberships.schema"
import {
  isClienteClass,
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
  validateDepartmentsPayload,
} from "@/modules/memberships/memberships-rules"
import { useCreateMemberWithUserMutation } from "@/modules/memberships/use-members"

export function CreateMemberForm({
  enterpriseId,
  config,
}: {
  enterpriseId: string
  config: MembershipRouteConfig
}) {
  const router = useRouter()
  const mutation = useCreateMemberWithUserMutation(enterpriseId)
  const fixedClass = config.create.fixedClass
  const [memberClass, setMemberClass] = useState<EnterpriseMemberClass>(
    fixedClass ?? "COLABORADOR"
  )
  const [departments, setDepartments] = useState<MemberDepartmentPayload[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const userName = (
      form.elements.namedItem("userName") as HTMLInputElement
    ).value.trim()
    const userRegistration = normalizeRegistration(
      (form.elements.namedItem("userRegistration") as HTMLInputElement).value
    )
    const userEmail = normalizeEmail(
      (form.elements.namedItem("userEmail") as HTMLInputElement).value
    )
    const userPhone = normalizePhone(
      (form.elements.namedItem("userPhone") as HTMLInputElement).value
    )
    if (!userName || !userRegistration || !userEmail || !userPhone) {
      toast.error("Preencha todos os campos do utilizador.")
      return
    }

    const resolvedClass = fixedClass ?? memberClass

    if (config.create.showDepartments) {
      const deptValidation = validateDepartmentsPayload(
        resolvedClass,
        departments
      )
      if (!deptValidation.ok) {
        toast.error(deptValidation.message)
        return
      }
    }

    try {
      const result = await mutation.mutateAsync({
        user: {
          userName,
          userRegistration,
          userEmail,
          userPhone,
        },
        member: {
          class: resolvedClass,
          departments: isClienteClass(resolvedClass) ? [] : departments,
        },
      })
      if (config.create.showDepartments && !isClienteClass(resolvedClass)) {
        toast.info(
          "O utilizador recebera um e-mail de primeiro acesso para concluir o cadastro."
        )
      }
      router.push(`${config.basePath}/${result.member.id}`)
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, config.create.createError)
        return
      }
      toast.error(config.create.createError)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{config.create.title}</CardTitle>
        <CardDescription>{config.create.description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        {config.create.note && (
          <p className="mb-4 text-sm text-muted-foreground">
            {config.create.note}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <Input
                  id="userName"
                  name="userName"
                  placeholder="Informe o nome"
                  required
                />
              </Field>
              <Field>
                <Input
                  id="userRegistration"
                  name="userRegistration"
                  placeholder="Informe o CPF/CNPJ"
                  required
                />
              </Field>
              <Field>
                <Input
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Informe o e-mail"
                />
              </Field>
              <Field>
                <Input
                  id="userPhone"
                  name="userPhone"
                  required
                  placeholder="Informe o telefone"
                />
              </Field>
              {!fixedClass && (
                <Field>
                  <Select
                    value={memberClass}
                    onValueChange={(v) => {
                      const next = v as EnterpriseMemberClass
                      setMemberClass(next)
                      if (isClienteClass(next)) setDepartments([])
                    }}
                  >
                    <SelectTrigger id="memberClass" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEMBER_CLASS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
              {config.create.showDepartments && (
                <Field className="sm:col-span-2">
                  <MemberDepartmentsPicker
                    memberClass={memberClass}
                    departments={departments}
                    onChange={setDepartments}
                  />
                </Field>
              )}
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
              tooltip={config.create.submitLabel}
            >
              {mutation.isPending
                ? config.create.submitPendingLabel
                : config.create.submitLabel}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
