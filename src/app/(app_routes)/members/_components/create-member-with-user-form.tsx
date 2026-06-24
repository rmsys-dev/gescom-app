"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { MemberClassDepartmentsFields } from "@/app/(app_routes)/members/_components/member-class-departments-fields"
import { useMemberClassDepartments } from "@/app/(app_routes)/members/_components/use-member-class-departments"
import {
  PageFormCard,
  type PageFormField,
} from "@/components/global/forms/page-form-card"
import {
  cpfCnpjSchema,
  cpfCnpjValidationMessage,
} from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import {
  isClienteClass,
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
  validateDepartmentsPayload,
} from "@/modules/memberships/memberships-rules"
import { useCreateMemberWithUserMutation } from "@/modules/memberships/use-members"

const USER_FIELDS_PAGE: PageFormField[] = [
  {
    id: "userName",
    name: "userName",
    placeholder: "Informe o nome",
    required: true,
    className: "sm:col-span-2",
  },
  {
    id: "userRegistration",
    name: "userRegistration",
    placeholder: "Informe o CPF/CNPJ",
    required: true,
  },
  {
    id: "userEmail",
    name: "userEmail",
    type: "email",
    autoComplete: "email",
    placeholder: "Informe o e-mail",
    required: true,
  },
  {
    id: "userPhone",
    name: "userPhone",
    placeholder: "Informe o telefone",
    required: true,
  },
]

const USER_FIELDS_SHEET: PageFormField[] = USER_FIELDS_PAGE.map((field) => ({
  ...field,
  className: undefined,
}))

export type CreateMemberWithUserFormProps = {
  enterpriseId: string
  class?: EnterpriseMemberClass
  defaultClass?: EnterpriseMemberClass
  variant?: "page" | "sheet"
  title?: string
  subtitle?: string
  submitLabel?: string
  pendingLabel?: string
  emptyFieldsMessage?: string
  onSuccess?: (memberId: string) => void
}

export function CreateMemberWithUserForm({
  enterpriseId,
  class: fixedClass,
  defaultClass = "COLABORADOR",
  variant = "sheet",
  title,
  subtitle,
  submitLabel = "Criar membro",
  pendingLabel = "Criando membro...",
  emptyFieldsMessage = "utilizador",
  onSuccess,
}: CreateMemberWithUserFormProps) {
  const router = useRouter()
  const mutation = useCreateMemberWithUserMutation(enterpriseId)
  const {
    memberClass,
    setMemberClass,
    departments,
    setDepartments,
    effectiveClass,
    showFields,
  } = useMemberClassDepartments({ fixedClass, defaultClass })

  const isSheet = variant === "sheet"
  const fields = isSheet ? USER_FIELDS_SHEET : USER_FIELDS_PAGE

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
      toast.error(`Preencha todos os campos do ${emptyFieldsMessage}.`)
      return
    }

    const regParsed = cpfCnpjSchema.safeParse(userRegistration)
    if (!regParsed.success) {
      toast.error(cpfCnpjValidationMessage(userRegistration))
      return
    }

    const phoneParsed = phoneE164Schema.safeParse(userPhone)
    if (!phoneParsed.success) {
      toast.error("Telefone inválido. Use formato +5511999999999.")
      return
    }

    const deptValidation = validateDepartmentsPayload(effectiveClass, departments)
    if (!deptValidation.ok) {
      toast.error(deptValidation.message)
      return
    }

    try {
      const result = await mutation.mutateAsync({
        user: {
          userName,
          userRegistration: regParsed.data,
          userEmail,
          userPhone: phoneParsed.data,
        },
        member: {
          class: effectiveClass,
          departments: isClienteClass(effectiveClass) ? [] : departments,
        },
      })
      if (onSuccess) {
        onSuccess(result.member.id)
      } else {
        router.push(`/members/${result.member.id}`)
      }
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <PageFormCard
      variant={variant}
      title={title ?? ""}
      subtitle={subtitle ?? ""}
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      pendingLabel={pendingLabel}
      isPending={mutation.isPending}
      cardClassName={isSheet ? "h-full" : undefined}
    >
      {showFields ? (
        <MemberClassDepartmentsFields
          memberClass={memberClass}
          departments={departments}
          onMemberClassChange={setMemberClass}
          onDepartmentsChange={setDepartments}
          departmentsFieldClassName={isSheet ? undefined : "sm:col-span-2"}
        />
      ) : null}
    </PageFormCard>
  )
}
