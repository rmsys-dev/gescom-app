"use client"

import { Fragment, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Moon, RefreshCw, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { SidebarToggleBar } from "@/app/(app_routes)/_components/app-sidebar"
import { usePageRefreshButton } from "@/app/(app_routes)/_components/page-refresh"
import { getBreadcrumbItems } from "@/app/(app_routes)/_components/route-labels"
import { TeamSwitcher } from "@/app/(app_routes)/_components/team-switcher"
import { useAuth } from "@/components/providers/authentication/auth-store"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

export function NavHeader() {
    const pathname = usePathname()
    const breadcrumbItems = getBreadcrumbItems(pathname)
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
        <header className="bg-sidebar flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">

                <SidebarToggleBar />

                <div className="min-w-0 flex-1 md:hidden">
                    <TeamSwitcher />
                </div>

                <Breadcrumb className="hidden min-w-0 md:block">
                    <BreadcrumbList className="text-base">
                        {breadcrumbItems.map((item, index) => {
                            const isLast = index === breadcrumbItems.length - 1

                            return (
                                <Fragment key={`${item.href ?? "current"}-${item.label}`}>
                                    {index > 0 ? <BreadcrumbSeparator /> : null}
                                    <BreadcrumbItem>
                                        {isLast || !item.href ? (
                                            <BreadcrumbPage className="text-foreground">{item.label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.href}>{item.label}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center gap-2 sm:gap-3 ml-auto">

                    <div className="items-center gap-2 hidden md:flex">
                        <div className="hidden min-w-0 text-right leading-tight sm:grid">
                            <span className="truncate text-xs font-medium">
                                {displayName}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                                {displayEmail}
                            </span>
                        </div>
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src="" alt={displayName} />
                            <AvatarFallback className="rounded-lg">
                                {displayName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <Separator orientation="vertical" className="data-[orientation=vertical]:h-auto" />

                    {pageRefresh ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={
                                pageRefresh.disabled || pageRefresh.isFetching
                            }
                            onClick={() => void pageRefresh.onRefresh()}
                            aria-label="Atualizar dados"
                            className="text-muted-foreground hover:bg-transparent dark:hover:bg-transparent hover:text-primary dark:hover:text-primary"
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
                        className="text-muted-foreground hover:bg-transparent dark:hover:bg-transparent hover:text-mist-950 dark:hover:text-white"
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                    >
                        {mounted ? (
                            isDark ? <Sun /> : <Moon />
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
                        className="text-muted-foreground hover:bg-transparent dark:hover:bg-transparent hover:text-red-500 dark:hover:text-red-500"
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
