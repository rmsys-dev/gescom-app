"use client"

import { MemberClassBadge } from "@/app/(app_routes)/members/_components/member-class-badge"
import { UserContactHeader } from "@/components/global/user-contact-header"
import { StatusBadge } from "@/components/global/returns/status-badge"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { formatPhone } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { MemberDetail } from "@/modules/memberships/memberships.schema"

type MemberProfileSummaryProps = {
  member: MemberDetail
  variant: "sheet" | "card"
  showContact?: boolean
}

export function MemberProfileSummary({
  member,
  variant,
  showContact = variant === "sheet",
}: MemberProfileSummaryProps) {
  const displayName = member.user.userName.trim()
  const isSheet = variant === "sheet"

  const badges = (
    <>
      <StatusBadge status={member.status} />
      <MemberClassBadge memberClass={member.class} />
    </>
  )

  const meta =
    isSheet && member.code != null ? (
      <span className="font-mono font-normal text-xs tabular-nums text-primary">
        {" "}
        Cód. {member.code}
      </span>
    ) : null

  if (variant === "card") {
    return (
      <Card className="border-none ring-0 shadow-md">
        <CardContent className="space-y-4 pt-6">
          <UserContactHeader
            displayName={displayName}
            headingLevel="h1"
            layout="centered"
            showContact={false}
            badges={badges}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <UserContactHeader
      displayName={displayName}
      email={member.user.userEmail}
      phone={formatPhone(member.user.userPhone)}
      phoneRaw={member.user.userPhone}
      headingLevel="h1"
      layout="row"
      showContact={showContact}
      badges={badges}
      meta={meta}
      nameClassName={cn(isSheet && "flex items-baseline gap-1")}
    />
  )
}
