"use client"

import { Mail, Phone } from "lucide-react"

import { MemberClassBadge } from "@/app/(app_routes)/members/_components/member-class-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { StatusBadge } from "@/components/global/returns/status-badge"
import { EMPTY_DISPLAY, formatPhone } from "@/lib/formatters"
import { getUserInitials } from "@/lib/user-initials"
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
  const initials = getUserInitials(displayName)
  const email = member.user.userEmail?.trim()
  const phone = formatPhone(member.user.userPhone)
  const hasContact = showContact && (Boolean(email) || phone !== EMPTY_DISPLAY)

  const avatar = (
    <Avatar
      size="default"
      className={cn(
        "size-20 shrink-0 ring-2 ring-primary shadow-md after:border-0 sm:size-24",
        variant === "card" && "mx-auto"
      )}
    >
      <AvatarFallback className="bg-transparent text-3xl font-semibold tracking-tight sm:text-4xl">
        <span className="text-primary">{initials}</span>
      </AvatarFallback>
    </Avatar>
  )

  const badges = (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        variant === "card" && "justify-center"
      )}
    >
      <StatusBadge status={member.status} />
      <MemberClassBadge memberClass={member.class} />
    </div>
  )

  const nameBlock = (
    <div className={cn("space-y-2", variant === "card" && "text-center")}>
      <h1
        className={cn(
          "font-heading text-xl font-semibold leading-tight sm:text-2xl",
          variant === "sheet" && "flex items-baseline gap-1"
        )}
      >
        {displayName}
        {variant === "sheet" && member.code != null ? (
          <span className="font-mono font-normal text-xs tabular-nums text-primary">
            Cód. {member.code}
          </span>
        ) : null}
      </h1>
      {badges}
    </div>
  )

  const contactBlock = hasContact ? (
    <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
      {email ? (
        <a
          href={`mailto:${email}`}
          className="inline-flex min-w-0 items-center gap-2 text-foreground underline-offset-4 transition-all duration-300 hover:scale-105 hover:cursor-pointer"
        >
          <Mail className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{email}</span>
        </a>
      ) : null}
      {phone !== EMPTY_DISPLAY ? (
        <a
          href={`tel:${member.user.userPhone}`}
          className="inline-flex min-w-0 items-center gap-2 text-foreground underline-offset-4 transition-all duration-300 hover:scale-105 hover:cursor-pointer"
        >
          <Phone className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{phone}</span>
        </a>
      ) : null}
    </div>
  ) : null

  if (variant === "card") {
    return (
      <Card className="border-none ring-0 shadow-md">
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-center">{avatar}</div>
          <div className="space-y-2">
            {nameBlock}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
      {avatar}
      <div className="min-w-0 flex-1 space-y-3">
        {nameBlock}
        {contactBlock}
      </div>
    </header>
  )
}
