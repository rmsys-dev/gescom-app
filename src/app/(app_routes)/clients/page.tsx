"use client"

import { MembersListPage } from "@/app/(app_routes)/members/_components/members-list-page"
import { CLIENTS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function ClientsPage() {
  return <MembersListPage config={CLIENTS_ROUTE_CONFIG} />
}
