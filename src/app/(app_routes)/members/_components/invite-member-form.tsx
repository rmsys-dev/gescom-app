"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MemberDepartmentsPicker } from "@/app/(app_routes)/members/_components/member-departments-picker"
import { MEMBER_CLASS_OPTIONS } from "@/modules/memberships/member-class-label"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
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
  config,
}: {
  enterpriseId: string
  config: MembershipRouteConfig
}) {
  const router = useRouter()
  const mutation = useInviteMemberMutation(enterpriseId)
  const [inviteEmail, setInviteEmail] = useState("")
  const [invitePhone, setInvitePhone] = useState("")
  const [memberClass, setMemberClass] =
    useState<EnterpriseMemberClass>("COLABORADOR")
  const [departments, setDepartments] = useState<MemberDepartmentPayload[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = inviteEmail ? normalizeEmail(inviteEmail) : undefined
    const phone = invitePhone ? normalizePhone(invitePhone) : undefined
    if (!email && !phone) {
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
        inviteEmail: email,
        invitePhone: phone,
      })
      toast.info(config.invite.inviteSuccessToast)
      router.push(`${config.basePath}/${result.memberId}`)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
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
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </Field>
              <Field>
                <Input
                  id="invitePhone"
                  name="invitePhone"
                  placeholder="Informe o telefone"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
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
              tooltip={config.invite.submitLabel}
            >
              {mutation.isPending
                ? config.invite.submitPendingLabel
                : config.invite.submitLabel}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
