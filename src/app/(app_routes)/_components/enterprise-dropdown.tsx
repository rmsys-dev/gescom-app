"use client"

import * as React from "react"
import { Building2, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"

import { HttpError } from "@/lib/api/http-error"
import { useAuth } from "@/components/providers/authentication/auth-store"
import type { AuthEnterprise } from "@/modules/authentication/auth.schema"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function EnterpriseDropdown() {
  const { enterprises, activeEnterprise, hydrated, switchToEnterprise } =
    useAuth()
  const [loadingId, setLoadingId] = React.useState<string | null>(null)

  const displayEnterprise = React.useMemo(() => {
    if (activeEnterprise) {
      return activeEnterprise
    }
    const first = enterprises[0]
    if (!first) return null
    return {
      id: first.id,
      tradeName: first.tradeName,
      legalName: first.legalName,
      memberId: first.memberId,
      memberDepartmentId: null as string | null,
    }
  }, [activeEnterprise, enterprises])

  async function onSelect(enterprise: AuthEnterprise) {
    if (enterprise.id === activeEnterprise?.id) {
      return
    }
    setLoadingId(enterprise.id)
    try {
      await switchToEnterprise(enterprise)
      toast.success("Empresa alterada.")
    } catch (error) {
      if (error instanceof HttpError) {
        toast.error(error.message)
        return
      }
      toast.error("Nao foi possivel mudar de empresa.")
    } finally {
      setLoadingId(null)
    }
  }

  if (!hydrated || enterprises.length === 0 || !displayEnterprise) {
    return null
  }

  const enterpriseIcon = (
    <div className="flex aspect-square size-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
      <Building2 className="size-4" />
    </div>
  )

  if (enterprises.length === 1) {
    return (
      <div
        className="hidden items-center gap-2 md:flex"
        title={displayEnterprise.tradeName}
      >
        {enterpriseIcon}
        <div className="hidden min-w-0 text-left leading-tight lg:grid">
          <span className="truncate text-xs font-medium">
            {displayEnterprise.tradeName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {displayEnterprise.legalName}
          </span>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          disabled={loadingId !== null}
          className={cn(
            "hidden h-auto items-center gap-2 px-2 py-1.5 md:flex",
            "hover:bg-transparent dark:hover:bg-transparent"
          )}
          aria-label="Trocar empresa"
        >
          {enterpriseIcon}
          <div className="hidden min-w-0 text-left leading-tight lg:grid">
            <span className="truncate text-xs font-medium">
              {displayEnterprise.tradeName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {displayEnterprise.legalName}
            </span>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Empresas
        </DropdownMenuLabel>
        {enterprises.map((enterprise, index) => (
          <DropdownMenuItem
            key={enterprise.id}
            disabled={loadingId !== null}
            onClick={() => void onSelect(enterprise)}
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center border">
              <Building2 className="size-3.5 shrink-0" />
            </div>
            <div className="grid min-w-0 flex-1 text-left">
              <span className="truncate font-medium">
                {enterprise.tradeName}
              </span>
              {loadingId === enterprise.id ? (
                <span className="text-xs text-muted-foreground">
                  A processar…
                </span>
              ) : null}
            </div>
            <DropdownMenuShortcut>#{index + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
