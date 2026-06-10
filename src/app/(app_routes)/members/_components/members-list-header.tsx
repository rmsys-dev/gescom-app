"use client"

import Link from "next/link"
import { UserPlus, UserRoundPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
import type { MembershipRoutePermissions } from "@/modules/memberships/membership-route-config"

export function MembersListHeader({
  config,
  perms,
}: {
  config: MembershipRouteConfig
  perms: MembershipRoutePermissions
}) {
  const secondary = config.header.secondaryAction
  const showSecondary = secondary?.canShow(perms) ?? false

  return (
    <div>
      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            {perms.canCreateMemberWithUser && (
              <Button
                asChild
                className="w-full"
                variant="outline"
                tooltip={config.header.createTooltip}
              >
                <Link href={config.header.createHref}>
                  <UserPlus className="size-4" aria-hidden />
                  {config.header.createLabel}
                </Link>
              </Button>
            )}
            {showSecondary && secondary && (
              <Button
                asChild
                className="w-full"
                variant="outline"
                tooltip={secondary.tooltip}
              >
                <Link href={secondary.href}>
                  <UserRoundPlus className="size-4" aria-hidden />
                  {secondary.label}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
