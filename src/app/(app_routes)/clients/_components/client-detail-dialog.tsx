"use client"

import { MembershipDetailDialog } from "@/app/(app_routes)/_components/memberships/membership-detail-dialog"
import { CLIENTS_ROUTE_CONFIG } from "@/modules/memberships/memberships-route-config"

type ClientDetailDialogProps = {
  clientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDetailDialog({
  clientId,
  open,
  onOpenChange,
}: ClientDetailDialogProps) {
  return (
    <MembershipDetailDialog
      membershipId={clientId}
      open={open}
      onOpenChange={onOpenChange}
      config={CLIENTS_ROUTE_CONFIG}
    />
  )
}
