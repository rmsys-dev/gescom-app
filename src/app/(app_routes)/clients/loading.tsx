import { MembershipRouteLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { CLIENTS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function Loading() {
  return <MembershipRouteLoading config={CLIENTS_ROUTE_CONFIG} />
}
