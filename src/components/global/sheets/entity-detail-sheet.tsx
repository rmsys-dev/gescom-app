"use client"

import type { ReactNode } from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { HttpError } from "@/lib/api/http-error"
import { cn } from "@/lib/utils"

export function getEntityErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof HttpError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

type EntityDetailSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  isPending: boolean
  error: unknown
  errorTitle: string
  fallbackErrorMessage: string
  loading?: ReactNode
  contentClassName?: string
  sheetClassName?: string
  showHeader?: boolean
  footer?: ReactNode
  notFound?: ReactNode
  children: ReactNode
}

export function EntityDetailSheet({
  open,
  onOpenChange,
  title,
  description,
  isPending,
  error,
  errorTitle,
  fallbackErrorMessage,
  loading,
  contentClassName,
  sheetClassName,
  showHeader = true,
  footer,
  notFound,
  children,
}: EntityDetailSheetProps) {
  const errMessage = getEntityErrorMessage(error, fallbackErrorMessage)
  const showError = Boolean(error) && !isPending
  const showContent = !isPending && !showError && !notFound

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn("flex flex-col gap-0 p-0", sheetClassName)}
      >
        {showHeader ? (
          <SheetHeader className="shrink-0 border-b px-6 py-4 text-left">
            <SheetTitle className="text-lg">{title}</SheetTitle>
            {description ? (
              <SheetDescription>{description}</SheetDescription>
            ) : null}
          </SheetHeader>
        ) : null}

        <div className={cn("flex-1 overflow-y-auto", contentClassName)}>
          {isPending && loading}

          {showError && (
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="text-base text-destructive">
                  {errorTitle}
                </CardTitle>
                <CardDescription>{errMessage}</CardDescription>
              </CardHeader>
            </Card>
          )}

          {notFound}

          {showContent ? children : null}
        </div>

        {footer ? (
          <SheetFooter className="shrink-0 border-t">{footer}</SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
