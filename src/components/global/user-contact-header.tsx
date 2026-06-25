"use client"

import type { ReactNode } from "react"
import { Mail, Phone } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EMPTY_DISPLAY, formatPhone } from "@/lib/formatters"
import { getUserInitials } from "@/lib/user-initials"
import { cn } from "@/lib/utils"

type UserContactHeaderProps = {
  displayName: string
  email?: string | null
  phone?: string | null
  phoneRaw?: string | null
  headingLevel?: "h1" | "h2"
  layout?: "row" | "centered"
  showContact?: boolean
  badges?: ReactNode
  meta?: ReactNode
  avatarClassName?: string
  nameClassName?: string
}

export function UserContactHeader({
  displayName,
  email,
  phone,
  phoneRaw,
  headingLevel = "h2",
  layout = "row",
  showContact = true,
  badges,
  meta,
  avatarClassName,
  nameClassName,
}: UserContactHeaderProps) {
  const initials = getUserInitials(displayName)
  const emailValue = email?.trim()
  const phoneDisplay = phone ?? (phoneRaw ? formatPhone(phoneRaw) : EMPTY_DISPLAY)
  const hasPhone = phoneDisplay !== EMPTY_DISPLAY
  const hasContact = showContact && (Boolean(emailValue) || hasPhone)
  const Heading = headingLevel

  const avatar = (
    <Avatar
      size="default"
      className={cn(
        "size-20 shrink-0 ring-2 ring-primary shadow-md after:border-0 sm:size-24",
        layout === "centered" && "mx-auto",
        avatarClassName
      )}
    >
      <AvatarFallback className="bg-transparent text-3xl font-semibold tracking-tight sm:text-4xl">
        <span className="text-primary">{initials}</span>
      </AvatarFallback>
    </Avatar>
  )

  const contactBlock = hasContact ? (
    <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
      {emailValue ? (
        <a
          href={`mailto:${emailValue}`}
          className="inline-flex min-w-0 items-center gap-2 text-foreground underline-offset-4 transition-all duration-300 hover:scale-105 hover:cursor-pointer"
        >
          <Mail className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{emailValue}</span>
        </a>
      ) : null}
      {hasPhone ? (
        <a
          href={`tel:${phoneRaw ?? phoneDisplay}`}
          className="inline-flex min-w-0 items-center gap-2 text-foreground underline-offset-4 transition-all duration-300 hover:scale-105 hover:cursor-pointer"
        >
          <Phone className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{phoneDisplay}</span>
        </a>
      ) : null}
    </div>
  ) : null

  const nameBlock = (
    <div className={cn("space-y-2", layout === "centered" && "text-center")}>
      <Heading
        className={cn(
          "font-heading text-xl font-semibold leading-tight sm:text-2xl",
          nameClassName
        )}
      >
        {displayName}
        {meta}
      </Heading>
      {badges ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            layout === "centered" && "justify-center"
          )}
        >
          {badges}
        </div>
      ) : null}
    </div>
  )

  if (layout === "centered") {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">{avatar}</div>
        {nameBlock}
      </div>
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
