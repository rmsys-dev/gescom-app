"use client"

import { useEffect, useMemo, useState } from "react"
import {
  FilePlus,
  Moon,
  ShoppingCart,
  Sun,
  Sunset,
  UserPlus,
} from "lucide-react"

import { useAuth } from "@/components/providers/authentication/auth-store"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type GreetingPeriod = "morning" | "afternoon" | "evening"

type GreetingInfo = {
  period: GreetingPeriod
  label: string
}

function getGreetingInfo(hour: number): GreetingInfo {
  if (hour >= 5 && hour < 12) {
    return { period: "morning", label: "Bom dia" }
  }

  if (hour >= 12 && hour < 18) {
    return { period: "afternoon", label: "Boa tarde" }
  }

  return { period: "evening", label: "Boa noite" }
}

function getFirstName(name: string | undefined): string {
  if (!name?.trim()) return "Usuário"
  return name.trim().split(/\s+/)[0] ?? "Usuário"
}

const GREETING_ICON = {
  morning: Sun,
  afternoon: Sunset,
  evening: Moon,
} as const

const GREETING_ICON_CLASS = {
  morning: "bg-gescom-accent-soft-bg text-gescom-main shadow-[0_0_0_6px_rgba(76,153,171,0.12)]",
  afternoon:
    "bg-gescom-accent-soft-bg text-gescom-secondary shadow-[0_0_0_6px_rgba(76,153,171,0.14)]",
  evening:
    "bg-gescom-background-sutil text-gescom-main shadow-[0_0_0_6px_rgba(40,97,125,0.1)]",
} as const

const QUICK_ACTIONS = [
  { label: "Nova venda", icon: ShoppingCart },
  { label: "Novo cliente", icon: UserPlus },
  { label: "Novo orçamento", icon: FilePlus },
] as const

export function HomeWelcomeCard() {
  const { user } = useAuth()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date())
    }, 60_000)

    return () => window.clearInterval(intervalId)
  }, [])

  const greeting = useMemo(() => getGreetingInfo(now.getHours()), [now])
  const firstName = getFirstName(user?.name)
  const GreetingIcon = GREETING_ICON[greeting.period]

  return (
    <Card className="overflow-hidden border border-dashed border-gescom-secondary/40 bg-linear-to-r from-gescom-accent-soft-bg via-gescom-background-sutil to-card shadow-main-xsmall ring-0">
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-full",
              GREETING_ICON_CLASS[greeting.period]
            )}
          >
            <GreetingIcon className="size-7" aria-hidden />
          </div>

          <div className="min-w-0 space-y-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {greeting.label}, {firstName}!
            </h1>
            <p className="text-sm text-muted-foreground">
              O que você deseja fazer hoje?
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant="default"
              className="bg-transparent border border-primary/20 border-dashed hover:bg-primary/75 hover:border-transparent hover:shadow-md hover:scale-101 transition-all duration-500"
            >
              <action.icon className="size-4" aria-hidden />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
