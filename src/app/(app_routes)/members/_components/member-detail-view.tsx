"use client"

import {
  MemberDetailHeader,
  MemberLinkCard,
  MemberUserInfoCard,
} from "@/app/(app_routes)/members/_components/member-field"
import { UserOnboardingPanel } from "@/app/(app_routes)/profile/_components/onboarding/user-onboarding-panel"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
import type { MemberDetail } from "@/modules/memberships/memberships.schema"
import type { UserDetailsResponse } from "@/modules/users-onboarding/users-onboarding.schema"

type MemberDetailViewProps = {
  member: MemberDetail
  config: MembershipRouteConfig
  enterpriseId: string
  onboardingDetails?: UserDetailsResponse
  canConsultUsers: boolean
  isOnboardingLoading?: boolean
}

export function MemberDetailView({
  member,
  config,
  enterpriseId,
  onboardingDetails,
  canConsultUsers,
  isOnboardingLoading = false,
}: MemberDetailViewProps) {
  return (
    <div className="space-y-6">
      <MemberDetailHeader member={member} config={config} />

      <MemberUserInfoCard
        user={member.user}
        enterpriseId={enterpriseId}
        memberId={member.id}
        canEdit={false}
      />

      <MemberLinkCard
        member={member}
        enterpriseId={enterpriseId}
        config={config}
        canEdit={false}
      />

      {canConsultUsers ? (
        <UserOnboardingPanel
          details={onboardingDetails}
          enterpriseId={enterpriseId}
          userId={member.user.id}
          memberId={member.id}
          canAlter={false}
          isLoading={isOnboardingLoading}
          title={config.labels.onboardingPanelTitle}
          description={config.labels.onboardingPanelDescription}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{config.labels.onboardingDeniedTitle}</CardTitle>
            <CardDescription>
              Necessita da permissão consultar_usuarios para ver os dados de
              onboarding.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
