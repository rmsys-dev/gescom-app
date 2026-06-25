"use client"

import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export type ListHeaderAction = {
  label: string
  icon: LucideIcon
  variant?: "default" | "outline"
  visible: boolean
  onClick: () => void
}

type ListHeaderActionsProps = {
  primary: ListHeaderAction
  secondary: ListHeaderAction
}

function ActionButton({ label, icon: Icon, variant = "default", visible, onClick }: ListHeaderAction) {
  if (!visible) return null

  return (
    <Button type="button" variant={variant} onClick={onClick}>
      <Icon className="size-4" aria-hidden />
      {label}
    </Button>
  )
}

export function ListHeaderActions({ primary, secondary }: ListHeaderActionsProps) {
  return (
    <>
      <ActionButton {...primary} />
      <ActionButton {...secondary} variant={secondary.variant ?? "outline"} />
    </>
  )
}
