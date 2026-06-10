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
import { MEMBERS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"
import { MEMBER_CLASS_OPTIONS } from "@/modules/memberships/member-class-label"
import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPayload } from "@/modules/memberships/memberships.schema"
import {
  isClienteClass,
  normalizeEmail,
  normalizePhone,
  validateDepartmentsPayload,
} from "@/modules/memberships/memberships-rules"
import { useInviteMemberMutation } from "@/modules/memberships/use-members"

export function InviteMemberForm({
  enterpriseId,
}: {
  enterpriseId: string
}) {
  const router = useRouter()
  const mutation = useInviteMemberMutation(enterpriseId)
  const [memberClass, setMemberClass] =
    useState<EnterpriseMemberClass>("COLABORADOR")
  const [departments, setDepartments] = useState<MemberDepartmentPayload[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const inviteEmailRaw = (
      form.elements.namedItem("inviteEmail") as HTMLInputElement
    ).value
    const invitePhoneRaw = (
      form.elements.namedItem("invitePhone") as HTMLInputElement
    ).value
    const inviteEmail = inviteEmailRaw
      ? normalizeEmail(inviteEmailRaw)
      : undefined
    const invitePhone = invitePhoneRaw
      ? normalizePhone(invitePhoneRaw)
      : undefined
    if (!inviteEmail && !invitePhone) {
      toast.error("Informe e-mail ou telefone.")
      return
    }

    const deptValidation = validateDepartmentsPayload(memberClass, departments)
    if (!deptValidation.ok) {
      toast.error(deptValidation.message)
      return
    }

    try {
      const result = await mutation.mutateAsync({
        member: {
          class: memberClass,
          departments: isClienteClass(memberClass) ? [] : departments,
        },
        inviteEmail,
        invitePhone,
      })
      toast.info(
        "O usuário deve aceitar o convite com o codigo recebido por e-mail ou telefone."
      )
      router.push(`${MEMBERS_ROUTE_CONFIG.basePath}/${result.memberId}`)
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Nao foi possivel enviar o convite.")
        return
      }
      toast.error("Nao foi possivel enviar o convite.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Convidar membro</CardTitle>
        <CardDescription>
          Vincule um usuário existente à empresa.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Informe o e-mail e/ou telefone do usuário já cadastrado. Ele
          receberá um convite para fazer parte da empresa.
        </p>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <Input
                  id="inviteEmail"
                  name="inviteEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="Informe o e-mail"
                />
              </Field>
              <Field>
                <Input
                  id="invitePhone"
                  name="invitePhone"
                  placeholder="Informe o telefone"
                />
              </Field>
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
              <Field className="sm:col-span-2">
                <MemberDepartmentsPicker
                  memberClass={memberClass}
                  departments={departments}
                  onChange={setDepartments}
                />
              </Field>
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
              tooltip="Enviar convite"
            >
              {mutation.isPending ? "A enviar..." : "Enviar convite"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
