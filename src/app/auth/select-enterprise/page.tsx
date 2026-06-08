"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { SelectEnterpriseRouteLoading } from "@/app/auth/select-enterprise/_components/select-enterprise-route-loading"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/components/providers/authentication/auth-store"
import { HttpError } from "@/lib/api/http-error"
import { isSafeInternalReturnUrl } from "@/lib/auth/return-url"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import type { Enterprise } from "@/modules/authentication/auth.schema"
import { useMinLoadingDisplay } from "@/hooks/use-min-loading-display"
import { Loader2 } from "lucide-react"

function SelectEnterprisePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { enterprises, hydrated, isAuthenticated, switchToEnterprise } =
    useAuth()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const returnUrl = searchParams.get("returnUrl")
  const showLoading = useMinLoadingDisplay(!hydrated || !isAuthenticated)

  useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated) {
      const loginPath = isSafeInternalReturnUrl(returnUrl)
        ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
        : "/auth/login"
      router.replace(loginPath)
      return
    }
    if (enterprises.length <= 1) {
      router.replace(
        isSafeInternalReturnUrl(returnUrl) ? returnUrl : "/home"
      )
    }
  }, [hydrated, isAuthenticated, enterprises.length, returnUrl, router])

  async function onSelect(enterprise: Enterprise) {
    setLoadingId(enterprise.id)
    try {
      await switchToEnterprise(enterprise)
      toast.success("Empresa selecionada.")
      router.push(isSafeInternalReturnUrl(returnUrl) ? returnUrl : "/home")
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível mudar de empresa.")
        return
      }
      toast.error("Não foi possível mudar de empresa.")
    } finally {
      setLoadingId(null)
    }
  }

  if (showLoading) {
    return <SelectEnterpriseRouteLoading />
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Qual empresa deseja acessar?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {enterprises.map((e) => (
            <Button
              key={e.id}
              type="button"
              variant="outline"
              className="h-auto justify-between py-3 text-left "
              disabled={loadingId !== null}
              tooltip={`Selecionar ${e.tradeName}`}
              onClick={() => void onSelect(e)}
            >
              <div className="flex flex-col">
                <span className="block font-semibold">{e.tradeName}</span>
                <span className="text-muted-foreground block text-xs font-extralight">
                  {e.legalName}
                </span>
              </div>
              {loadingId === e.id ? (
                <span className="text-muted-foreground block text-xs font-normal">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </span>
              ) : null}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default function SelectEnterprisePage() {
  return (
    <Suspense fallback={<SelectEnterpriseRouteLoading />}>
      <SelectEnterprisePageContent />
    </Suspense>
  )
}
