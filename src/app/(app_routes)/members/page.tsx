"use client"

import { MembersListPage } from "@/app/(app_routes)/members/_components/members-list-page"
import { MEMBERS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function MembersPage() {
  return <MembersListPage config={MEMBERS_ROUTE_CONFIG} />
}
