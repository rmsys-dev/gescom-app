"use client"

import { CreateMemberPageContent } from "@/app/(app_routes)/members/_components/create-member-page"
import { MEMBERS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function NewMemberPage() {
  return <CreateMemberPageContent config={MEMBERS_ROUTE_CONFIG} />
}
