"use client"

import { RouteBreadcrumb } from "../navigation/route-breadcrumb"

type PageHeaderProps = {
    title: string
    subtitle: string
}
export function PageHeader({
    title,
    subtitle,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 ">
            <RouteBreadcrumb />
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
        </div>
    )
}
