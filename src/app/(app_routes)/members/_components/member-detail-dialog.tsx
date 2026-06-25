"use client"

import { MembershipDetailDialog } from "@/app/(app_routes)/_components/memberships/membership-detail-dialog"
import { MEMBERS_ROUTE_CONFIG } from "@/modules/memberships/memberships-route-config"

type MemberDetailDialogProps = {
  memberId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberDetailDialog({
  memberId,
  open,
  onOpenChange,
}: MemberDetailDialogProps) {
  return (
    <MembershipDetailDialog
      membershipId={memberId}
      open={open}
      onOpenChange={onOpenChange}
      config={MEMBERS_ROUTE_CONFIG}
    />
  )
}
