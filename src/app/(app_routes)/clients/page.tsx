"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { ClientsListHeader } from "@/app/(app_routes)/clients/_components/client-field"
import { ClientsContentLoading } from "@/app/(app_routes)/clients/_components/clients-route-loading"
import { defaultClientListFilters } from "@/app/(app_routes)/clients/_components/clients-constants"
import { ClientsFilters } from "@/app/(app_routes)/clients/_components/clients-filters"
import { ClientsTable } from "@/app/(app_routes)/clients/_components/clients-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { HttpError } from "@/lib/api/http-error"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"
import { useMembersQuery } from "@/modules/memberships/use-members"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"

export default function ClientsPage() {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const [draftFilters, setDraftFilters] = useState<ListMembersQuery>(
    defaultClientListFilters()
  )
  const [appliedFilters, setAppliedFilters] = useState<ListMembersQuery>(
    defaultClientListFilters()
  )

  const { data, error, isPending, isFetching, refetch } = useMembersQuery({
    enterpriseId,
    filters: appliedFilters,
    enabled: ready && perms.canConsultMembers,
  })

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: ready && perms.isReady && !perms.isError && perms.canConsultMembers,
  })

  const applyFiltersFromForm = useCallback(() => {
    const form = document.getElementById("clients-filters-form")
    if (!form || !(form instanceof HTMLFormElement)) {
      setAppliedFilters({ ...draftFilters, offset: 0 })
      return
    }
    const emailEl = form.elements.namedItem("email") as HTMLInputElement | null
    const regEl = form.elements.namedItem(
      "registration"
    ) as HTMLInputElement | null
    const phoneEl = form.elements.namedItem("phone") as HTMLInputElement | null

    let registration: string | undefined
    if (regEl?.value.trim()) {
      const regParsed = cpfCnpjSchema.safeParse(
        normalizeRegistration(regEl.value)
      )
      if (!regParsed.success) {
        toast.error("CPF/CNPJ inválido para filtro.")
        return
      }
      registration = regParsed.data
    }

    let phone: string | undefined
    if (phoneEl?.value.trim()) {
      const phoneParsed = phoneE164Schema.safeParse(
        normalizePhone(phoneEl.value)
      )
      if (!phoneParsed.success) {
        toast.error("Telefone inválido. Use formato +5511999999999.")
        return
      }
      phone = phoneParsed.data
    }

    setAppliedFilters({
      ...draftFilters,
      offset: 0,
      email: emailEl?.value ? normalizeEmail(emailEl.value) : undefined,
      registration,
      phone,
    })
  }, [draftFilters])

  const clearFilters = useCallback(() => {
    const reset = defaultClientListFilters()
    setDraftFilters(reset)
    setAppliedFilters(reset)
  }, [])

  const errMessage =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Não foi possível carregar os clientes."

  const errMeta =
    error instanceof HttpError
      ? { code: error.code, status: error.status, requestId: error.requestId }
      : null

  if (!ready || !perms.isReady) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <ClientsContentLoading />
      </main>
    )
  }

  if (perms.isError) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Não foi possível carregar permissões</CardTitle>
            <CardDescription>
              Não foi possível obter as permissões da sessão. Tente atualizar a
              página ou iniciar sessão novamente.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  if (!perms.canConsultMembers) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Sem permissão</CardTitle>
            <CardDescription>
              Necessita da permissão consultar_membros para ver esta área.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      {isPending && <ClientsContentLoading />}

      {error && data && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
        >
          <p className="font-medium">Não foi possível atualizar a lista.</p>
          <p className="mt-1 text-amber-900/90 dark:text-amber-50/90">
            {errMessage}. Os valores abaixo podem estar desatualizados.
          </p>
        </div>
      )}

      {error && !data && !isPending && (
        <Card className="border-destructive/40 ring-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">
              Erro ao carregar clientes
            </CardTitle>
            <CardDescription>{errMessage}</CardDescription>
          </CardHeader>
          {errMeta && (
            <CardContent>
              <dl className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                <div>
                  <dt className="font-medium text-foreground">Código</dt>
                  <dd className="font-mono">{errMeta.code}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">HTTP</dt>
                  <dd>{errMeta.status}</dd>
                </div>
                <div className="min-w-0 sm:col-span-1">
                  <dt className="font-medium text-foreground">Request ID</dt>
                  <dd className="truncate font-mono">
                    {errMeta.requestId ?? "—"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          )}
        </Card>
      )}

      {data && !isPending && (
        <div className="space-y-6">
          <ClientsListHeader
            canCreateClient={perms.canCreateMemberWithUser}
            canLink={
              perms.canIncludeMembers && perms.canConsultUsers
            }
          />
          <form
            id="clients-filters-form"
            onSubmit={(e) => {
              e.preventDefault()
              applyFiltersFromForm()
            }}
          >
            <ClientsFilters
              filters={draftFilters}
              onChange={setDraftFilters}
              onApply={applyFiltersFromForm}
              onClear={clearFilters}
            />
          </form>
          <ClientsTable
            items={data.items}
            total={data.total}
            limit={data.limit}
            offset={data.offset}
            onPageChange={(offset) =>
              setAppliedFilters((f) => ({ ...f, offset }))
            }
          />
        </div>
      )}
    </main>
  )
}
