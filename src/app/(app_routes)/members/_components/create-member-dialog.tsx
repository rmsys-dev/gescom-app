"use client"

import { CreateMemberForm } from "@/app/(app_routes)/members/_components/create-member-form"
import { MemberFormSheet } from "@/app/(app_routes)/members/_components/member-form-sheet"

type CreateMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  onSuccess?: (memberId: string) => void
}

export function CreateMemberDialog({
  open,
  onOpenChange,
  enterpriseId,
  onSuccess,
}: CreateMemberDialogProps) {
  return (
    <MemberFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Novo membro"
      description="Crie um novo membro com um novo usuário"
    >
      <CreateMemberForm
        enterpriseId={enterpriseId}
        onSuccess={onSuccess}
      />
    </MemberFormSheet>
  )
}
