"use client"

import { MemberDetailPageContent } from "@/app/(app_routes)/members/_components/member-detail-page"
import { MEMBERS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function MemberDetailPage() {
  return (
    <MemberDetailPageContent
      config={MEMBERS_ROUTE_CONFIG}
      paramKey="memberId"
    />
  )
}
