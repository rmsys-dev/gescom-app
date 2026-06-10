"use client"

import { MemberDetailPageContent } from "@/app/(app_routes)/members/_components/member-detail-page"
import { CLIENTS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function ClientDetailPage() {
  return (
    <MemberDetailPageContent
      config={CLIENTS_ROUTE_CONFIG}
      paramKey="clientId"
    />
  )
}
