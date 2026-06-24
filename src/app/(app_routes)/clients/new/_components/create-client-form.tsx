"use client"

import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"

import { CreateMemberWithUserForm } from "@/app/(app_routes)/members/_components/create-member-with-user-form"

export function CreateClientForm({
  enterpriseId,
  class: fixedClass,
  title = "Novo cliente",
  subtitle = "Crie um novo cliente com um novo usuário",
  submitLabel = "Criar cliente",
  pendingLabel = "Criando cliente...",
}: {
  enterpriseId: string
  class?: EnterpriseMemberClass
  title?: string
  subtitle?: string
  submitLabel?: string
  pendingLabel?: string
}) {
  return (
    <CreateMemberWithUserForm
      enterpriseId={enterpriseId}
      class={fixedClass}
      defaultClass="CLIENTE"
      variant="page"
      title={title}
      subtitle={subtitle}
      submitLabel={submitLabel}
      pendingLabel={pendingLabel}
      emptyFieldsMessage="cliente"
    />
  )
}
