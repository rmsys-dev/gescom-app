"use client"

import { Link2, Send, UserPlus } from "lucide-react"

import { ListHeaderActions } from "@/components/global/structural/list-header-actions"
import type { MembershipRouteConfig } from "@/modules/memberships/memberships-route-config"

const ACTION_ICONS = {
  UserPlus,
  Send,
  Link2,
} as const

type MembershipListActionsProps = {
  config: MembershipRouteConfig
  canCreate: boolean
  canSecondary: boolean
  onCreate: () => void
  onSecondary: () => void
}

export function MembershipListActions({
  config,
  canCreate,
  canSecondary,
  onCreate,
  onSecondary,
}: MembershipListActionsProps) {
  const { primary, secondary } = config.actions

  return (
    <ListHeaderActions
      primary={{
        label: primary.label,
        icon: ACTION_ICONS[primary.icon],
        visible: canCreate,
        onClick: onCreate,
      }}
      secondary={{
        label: secondary.label,
        icon: ACTION_ICONS[secondary.icon],
        visible: canSecondary,
        onClick: onSecondary,
      }}
    />
  )
}
