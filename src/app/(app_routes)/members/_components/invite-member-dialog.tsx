"use client"

import { InviteMemberForm } from "@/app/(app_routes)/members/_components/invite-member-form"
import { MemberFormSheet } from "@/app/(app_routes)/members/_components/member-form-sheet"

type InviteMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  onSuccess?: (memberId: string) => void
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  enterpriseId,
  onSuccess,
}: InviteMemberDialogProps) {
  return (
    <MemberFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Convite de membro"
      description="Envie um convite para um novo membro"
    >
      <InviteMemberForm
        enterpriseId={enterpriseId}
        onSuccess={onSuccess}
      />
    </MemberFormSheet>
  )
}
