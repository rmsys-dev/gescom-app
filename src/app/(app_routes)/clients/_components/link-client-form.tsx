"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

import { UserProfileSummary } from "@/app/(app_routes)/clients/_components/user-profile-summary"
import { SearchForm } from "@/components/global/forms/search-form"
import { AnimatedLoading } from "@/components/global/loading/animated-loading"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CLIENT_MEMBER_CLASS } from "@/modules/memberships/memberships-rules"
import { buildSearchFieldsFromDraft } from "@/modules/memberships/use-membership-listing"
import { useCreateMemberMutation } from "@/modules/memberships/use-members"
import type { ListUsersQuery } from "@/modules/users/users.schema"
import {
  defaultUsersDraftFilters,
  defaultUsersListFilters,
  type UsersDraftFilters,
  usersDraftFiltersToQuery,
} from "@/modules/users/users-rules"
import { useUsersQuery } from "@/modules/users/use-users"

type UserFilterKey = keyof Pick<
  UsersDraftFilters,
  "registration" | "email" | "phone"
>

const USER_FILTER_FIELDS: Array<{
  id: string
  key: UserFilterKey
  label: string
  placeholder: string
  inputMode?: "text" | "numeric"
  numericOnly?: boolean
}> = [
    {
      id: "registration",
      key: "registration",
      label: "CPF/CNPJ",
      placeholder: "Informe o CPF ou CNPJ",
      inputMode: "numeric",
      numericOnly: true,
    },
    {
      id: "email",
      key: "email",
      label: "E-mail",
      placeholder: "Informe o e-mail",
    },
    {
      id: "phone",
      key: "phone",
      label: "Telefone",
      placeholder: "Informe o telefone",
    },
  ]

function hasIdentifierCriteria(draft: UsersDraftFilters): boolean {
  return (
    draft.registration.trim().length > 0 ||
    draft.email.trim().length > 0 ||
    draft.phone.trim().length > 0
  )
}

export function LinkClientForm({
  enterpriseId,
  onSuccess,
}: {
  enterpriseId: string
  onSuccess?: (clientId: string) => void
}) {
  const linkMutation = useCreateMemberMutation(enterpriseId)
  const [draftFilters, setDraftFilters] = useState(defaultUsersDraftFilters())
  const [appliedQuery, setAppliedQuery] = useState<ListUsersQuery>(
    defaultUsersListFilters()
  )
  const [hasSearched, setHasSearched] = useState(false)

  const { data, error, isPending, isFetching } = useUsersQuery({
    enterpriseId,
    filters: appliedQuery,
    enabled: hasSearched,
    fetchAllPages: false,
  })

  const applySearch = useCallback(() => {
    if (draftFilters.name.trim().length > 0) {
      toast.error(
        "Informe CPF/CNPJ, e-mail ou telefone para buscar um usuário específico."
      )
      return
    }

    if (!hasIdentifierCriteria(draftFilters)) {
      toast.error("Informe CPF/CNPJ, e-mail ou telefone para buscar.")
      return
    }

    const { query, error: validationError } =
      usersDraftFiltersToQuery(draftFilters)
    if (validationError) {
      toast.error(validationError)
      return
    }

    setAppliedQuery(query)
    setHasSearched(true)
  }, [draftFilters])

  const clearSearch = useCallback(() => {
    setDraftFilters(defaultUsersDraftFilters())
    setAppliedQuery(defaultUsersListFilters())
    setHasSearched(false)
  }, [])

  const searchFields = useMemo(
    () =>
      buildSearchFieldsFromDraft(
        draftFilters,
        USER_FILTER_FIELDS,
        setDraftFilters
      ),
    [draftFilters]
  )

  async function handleLink(userId: string) {
    try {
      const member = await linkMutation.mutateAsync({
        userId,
        class: CLIENT_MEMBER_CLASS,
        departments: [],
      })
      onSuccess?.(member.id)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  const isSearching = hasSearched && (isFetching || isPending)
  const items = data?.items ?? []
  const matchedUser = items.length === 1 ? items[0] : null

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <SearchForm
        title="Buscar usuário"
        idPrefix="users-filters-form"
        fields={searchFields}
        onSearch={applySearch}
        isSearching={isSearching}
        hasSearched={hasSearched}
        appliedValues={{
          registration: appliedQuery.registration,
          email: appliedQuery.email,
          phone: appliedQuery.phone,
        }}
        searchLabel="Buscar usuário"
        searchTooltip="Buscar usuário"
        loadingLabel="Buscando usuário..."
        footer={
          hasSearched ? (
            <Button
              type="button"
              variant="outline"
              disabled={isSearching}
              onClick={clearSearch}
            >
              Limpar
            </Button>
          ) : null
        }
      />

      {hasSearched && isSearching && <AnimatedLoading />}

      {hasSearched && !isSearching && error && (
        <Card className="border-dashed border-2 border-primary/45 m-2 ring-0">
          <CardHeader>
            <CardTitle className="text-primary">Erro na busca</CardTitle>
            <CardDescription>
              Não foi possível buscar o usuário. Tente novamente.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {hasSearched && !isSearching && !error && items.length === 0 && (
        <Card className="border-dashed border-2 border-primary/45 m-2 ring-0">
          <CardHeader>
            <CardTitle className="text-primary">Usuário não encontrado</CardTitle>
            <CardDescription>
              Nenhum usuário corresponde aos critérios informados.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {hasSearched && !isSearching && !error && items.length > 1 && (
        <Card className="border-dashed border-2 border-primary/45 m-2 ring-0">
          <CardHeader>
            <CardTitle className="text-primary">Múltiplos resultados</CardTitle>
            <CardDescription>
              Refine a busca com um critério mais específico (CPF/CNPJ,
              e-mail ou telefone).
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {hasSearched && !isSearching && matchedUser && (
        <div className="space-y-4 border-dashed border-2 border-primary/45 m-2 p-4">
          <UserProfileSummary user={matchedUser} />
          <Button
            type="button"
            className="w-full"
            disabled={linkMutation.isPending}
            onClick={() => void handleLink(matchedUser.id)}
          >
            {linkMutation.isPending ? "Vinculando cliente..." : "Vincular cliente"}
          </Button>
        </div>
      )}
    </div>
  )
}
