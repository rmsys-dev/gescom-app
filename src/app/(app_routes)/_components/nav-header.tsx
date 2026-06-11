"use client"

import { useEffect, useState } from "react"
import { LogOut, Moon, RefreshCw, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { User } from "lucide-react"

import { EnterpriseDropdown } from "@/app/(app_routes)/_components/enterprise-dropdown"
import { NavHeaderDateTimeWeather } from "@/app/(app_routes)/_components/nav-header-datetime-weather"
import { usePageRefreshButton } from "@/app/(app_routes)/_components/page-refresh"
import { useAuth } from "@/components/providers/authentication/auth-store"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function NavHeader() {
  const { user, logout } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pageRefresh = usePageRefreshButton()

  useEffect(() => {
    setTimeout(() => {
      setMounted(true)
    }, 100)
  }, [])

  const displayName = user?.name ?? "Usuário"
  const displayEmail = user?.email ?? user?.registration ?? ""
  const isDark = resolvedTheme === "dark"

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-sidebar">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <NavHeaderDateTimeWeather />

        <Separator
          orientation="vertical"
          className="hidden data-[orientation=vertical]:h-auto md:block"
        />

        <div className="hidden items-center gap-2 md:flex">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src="" alt={displayName} />
            <AvatarFallback className="rounded-lg bg-transparent">
              <User className="size-4 text-foreground/30" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 leading-tight sm:grid">
            <span className="truncate text-xs font-medium">{displayName}</span>
            <span className="truncate text-xs text-muted-foreground">
              {displayEmail}
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <EnterpriseDropdown />

          <Separator
            orientation="vertical"
            className="hidden data-[orientation=vertical]:h-auto md:block"
          />

          {pageRefresh ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={pageRefresh.disabled || pageRefresh.isFetching}
              onClick={() => void pageRefresh.onRefresh()}
              aria-label="Atualizar dados"
              className="text-muted-foreground hover:bg-transparent hover:text-primary dark:hover:bg-transparent dark:hover:text-primary"
            >
              <RefreshCw
                className={`size-4 ${pageRefresh.isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isDark ? "Modo claro" : "Modo escuro"}
            className="text-muted-foreground hover:bg-transparent hover:text-mist-950 dark:hover:bg-transparent dark:hover:text-white"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {mounted ? (
              isDark ? (
                <Sun />
              ) : (
                <Moon />
              )
            ) : (
              <Moon className="opacity-0" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isLoggingOut}
            aria-label="Sair da sessão"
            className="text-muted-foreground hover:bg-transparent hover:text-red-500 dark:hover:bg-transparent dark:hover:text-red-500"
            onClick={() => {
              setIsLoggingOut(true)
              void logout().finally(() => setIsLoggingOut(false))
            }}
          >
            {isLoggingOut ? "Saindo…" : <LogOut />}
          </Button>
        </div>
      </div>
    </header>
  )
}
