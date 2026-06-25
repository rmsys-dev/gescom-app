"use client"

import { MembershipList } from "@/app/(app_routes)/_components/memberships/membership-list"
import { MEMBERS_ROUTE_CONFIG } from "@/modules/memberships/memberships-route-config"

export function MembersList() {
  return <MembershipList config={MEMBERS_ROUTE_CONFIG} />
}
