"use client"

import { CreateMemberPageContent } from "@/app/(app_routes)/members/_components/create-member-page"
import { CLIENTS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function NewClientPage() {
  return <CreateMemberPageContent config={CLIENTS_ROUTE_CONFIG} />
}
