"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { MemberClassDepartmentsFields } from "@/app/(app_routes)/members/_components/member-class-departments-fields"
import { useMemberClassDepartments } from "@/app/(app_routes)/members/_components/use-member-class-departments"
import {
  PageFormCard,
  type PageFormField,
} from "@/components/global/forms/page-form-card"
import { phoneE164Schema } from "@/lib/validation/phone"
import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import {
  isClienteClass,
  normalizeEmail,
  normalizePhone,
  validateDepartmentsPayload,
} from "@/modules/memberships/memberships-rules"
import { useInviteMemberMutation } from "@/modules/memberships/use-members"

const INVITE_FIELDS: PageFormField[] = [
  {
    id: "inviteEmail",
    name: "inviteEmail",
    type: "email",
    autoComplete: "email",
    placeholder: "Informe o e-mail",
  },
  {
    id: "invitePhone",
    name: "invitePhone",
    placeholder: "Informe o telefone",
  },
]

export function InviteMemberForm({
  enterpriseId,
  class: fixedClass,
  submitLabel = "Enviar convite",
  pendingLabel = "Enviando convite...",
  onSuccess,
}: {
  enterpriseId: string
  class?: EnterpriseMemberClass
  submitLabel?: string
  pendingLabel?: string
  onSuccess?: (memberId: string) => void
}) {
  const router = useRouter()
  const mutation = useInviteMemberMutation(enterpriseId)
  const {
    memberClass,
    setMemberClass,
    departments,
    setDepartments,
    effectiveClass,
    showFields,
  } = useMemberClassDepartments({ fixedClass })

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
      toast.error("Informe o e-mail ou o telefone.")
      return
    }

    let normalizedPhone: string | undefined
    if (invitePhone) {
      const phoneParsed = phoneE164Schema.safeParse(invitePhone)
      if (!phoneParsed.success) {
        toast.error("Telefone inválido. Use formato +5511999999999.")
        return
      }
      normalizedPhone = phoneParsed.data
    }

    const deptValidation = validateDepartmentsPayload(effectiveClass, departments)
    if (!deptValidation.ok) {
      toast.error(deptValidation.message)
      return
    }

    try {
      const result = await mutation.mutateAsync({
        member: {
          class: effectiveClass,
          departments: isClienteClass(effectiveClass) ? [] : departments,
        },
        inviteEmail,
        invitePhone: normalizedPhone,
      })
      if (onSuccess) {
        onSuccess(result.memberId)
      } else {
        router.push(`/members/${result.memberId}`)
      }
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <PageFormCard
      variant="sheet"
      title=""
      subtitle=""
      fields={INVITE_FIELDS}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      pendingLabel={pendingLabel}
      isPending={mutation.isPending}
      cardClassName="h-full"
    >
      {showFields ? (
        <MemberClassDepartmentsFields
          memberClass={memberClass}
          departments={departments}
          onMemberClassChange={setMemberClass}
          onDepartmentsChange={setDepartments}
        />
      ) : null}
    </PageFormCard>
  )
}
