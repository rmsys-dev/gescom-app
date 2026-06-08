"use client"

import * as React from "react"
import {
    Bell, Building2, ChartArea, HelpCircle, Link2, Package, Settings, ShoppingCart, User,
    Users
} from "lucide-react"

import { NavMain } from "@/app/(app_routes)/_components/nav-main"
import { TeamSwitcher } from "@/app/(app_routes)/_components/team-switcher"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavConfiguration } from "./nav-config"
import { NavSystem } from "./nav-system"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/providers/authentication/auth-store"

const data = {
    // navMain: [
    //     {
    //         title: "Telas",
    //         url: "#",
    //         icon: Home,
    //         items: [
    //             {
    //                 title: ROUTE_LABELS["/dashboard"],
    //                 url: "/dashboard",
    //             },
    //             {
    //                 title: "Clientes",
    //                 url: "/clients",
    //             },
    //             {
    //                 title: "Membros",
    //                 url: "/members",
    //             },
    //         ],
    //     },
    // ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: ChartArea,
        },
        {
            title: "Clientes",
            url: "/clients",
            icon: Users,
        },
        {
            title: "Membros",
            url: "/members",
            icon: Link2,
        },
        {
            title: "Produtos",
            url: "/products",
            icon: Package,
        },
        {
            title: "Vendas",
            url: "/sales",
            icon: ShoppingCart,
            items: [
                {
                    title: "Dashboard",
                    url: "/sales/dashboard",
                },
                {
                    title: "Pedidos",
                    url: "/sales",
                },
            ],
        },
    ],
    navConfiguration: [
        {
            title: "Empresa",
            url: "/enterprise",
            icon: Building2,
        },
        {
            title: "Meu perfil",
            url: "/profile",
            icon: User,
        },
    ],
    navSystem: [
        {
            title: "Notificações",
            url: "/notifications",
            icon: Bell,
        },
        {
            title: "Configuração",
            url: "/settings",
            icon: Settings,
        },
        {
            title: "Suporte",
            url: "/support",
            icon: HelpCircle,
        },
    ],
}



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth()

    const displayName = user?.name ?? "Utilizador"
    const displayEmail = user?.email ?? user?.registration ?? ""
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="border-b border-border h-14">
                <div className="flex w-full flex-col items-center gap-2">
                    <div className="flex w-full items-center justify-center">
                        <Image
                            src="/enterprise-logo.png"
                            alt="Gescom"
                            width={200}
                            height={52}
                            priority
                            className="h-auto w-full max-w-[140px] object-contain group-data-[collapsible=icon]:hidden"
                        />
                        <Image
                            src="/enterprise-icon.png"
                            alt="Gescom"
                            width={32}
                            height={32}
                            priority
                            className="hidden size-8 shrink-0 object-contain group-data-[collapsible=icon]:block"
                        />
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="flex flex-col justify-between gap-4">
                <NavMain items={data.navMain} />
                <div className="flex flex-col">
                    <Separator />
                    <NavConfiguration items={data.navConfiguration} />
                    <Separator />
                    <NavSystem items={data.navSystem} />
                </div>
            </SidebarContent>
            <SidebarFooter className=" w-full border-t border-border">
                <div className="hidden md:flex w-full items-center justify-center">
                    <TeamSwitcher />
                </div>
                <div className="flex justify-start gap-2 md:hidden py-2">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="" alt={displayName} />
                        <AvatarFallback className="rounded-lg">
                            {displayName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 text-left leading-tight">
                        <span className="truncate text-xs font-medium">
                            {displayName}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {displayEmail}
                        </span>
                    </div>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
