"use client"

import { MembershipDetailPage } from "@/app/(app_routes)/_components/memberships/membership-detail-page"
import { MEMBERS_ROUTE_CONFIG } from "@/modules/memberships/memberships-route-config"

export default function MemberDetailRoutePage() {
  return <MembershipDetailPage config={MEMBERS_ROUTE_CONFIG} />
}
