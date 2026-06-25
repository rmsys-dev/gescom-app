"use client"

import { MembershipList } from "@/app/(app_routes)/_components/memberships/membership-list"
import { CLIENTS_ROUTE_CONFIG } from "@/modules/memberships/memberships-route-config"

export function ClientsList() {
  return <MembershipList config={CLIENTS_ROUTE_CONFIG} />
}
