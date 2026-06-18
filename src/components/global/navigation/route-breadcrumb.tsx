"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  getBreadcrumbItems,
  isNestedOrDynamicRoute,
} from "@/app/(app_routes)/_components/route-labels"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

type RouteBreadcrumbProps = {
  currentLabel?: string
  className?: string
}

export function RouteBreadcrumb({
  currentLabel,
  className,
}: RouteBreadcrumbProps) {
  const pathname = usePathname()

  if (!isNestedOrDynamicRoute(pathname)) {
    return null
  }

  const items = getBreadcrumbItems(pathname)

  if (items.length === 0) {
    return null
  }

  const resolvedItems =
    currentLabel && items.length > 0
      ? items.map((item, index) =>
          index === items.length - 1 ? { ...item, label: currentLabel } : item
        )
      : items

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList>
        {resolvedItems.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? <BreadcrumbSeparator /> : null}
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
