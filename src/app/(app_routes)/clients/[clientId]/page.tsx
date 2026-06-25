"use client"

import { MembershipDetailPage } from "@/app/(app_routes)/_components/memberships/membership-detail-page"
import { CLIENTS_ROUTE_CONFIG } from "@/modules/memberships/memberships-route-config"

export default function ClientDetailRoutePage() {
  return <MembershipDetailPage config={CLIENTS_ROUTE_CONFIG} />
}
