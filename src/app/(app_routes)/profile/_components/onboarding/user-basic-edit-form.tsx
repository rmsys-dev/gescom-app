"use client"

import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import { memberQueryKey } from "@/modules/memberships/memberships-query-keys"
import type { MemberUserSummary } from "@/modules/memberships/memberships.schema"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"
import { useUpdateUserMutation } from "@/modules/users/use-users"
import { userDetailsQueryKey } from "@/modules/users-onboarding/use-users-onboarding"

export function UserBasicEditForm({
  open,
  onOpenChange,
  enterpriseId,
  userId,
  memberId,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  userId: string
  memberId?: string
  user: MemberUserSummary
}) {
  const queryClient = useQueryClient()
  const mutation = useUpdateUserMutation(enterpriseId, userId)
  const [userName, setUserName] = useState(user.userName)
  const [userRegistration, setUserRegistration] = useState(user.userRegistration)
  const [userEmail, setUserEmail] = useState(user.userEmail ?? "")
  const [userPhone, setUserPhone] = useState(user.userPhone ?? "")

  useEffect(() => {
    if (!open) return
    queueMicrotask(() => {
      setUserName(user.userName)
      setUserRegistration(user.userRegistration)
      setUserEmail(user.userEmail ?? "")
      setUserPhone(user.userPhone ?? "")
    })
  }, [open, user])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const patch: {
      userName?: string
      userRegistration?: string
      userEmail?: string
      userPhone?: string
    } = {}

    const name = userName.trim()
    const registration = normalizeRegistration(userRegistration)
    const email = normalizeEmail(userEmail)
    const phone = normalizePhone(userPhone)

    if (name && name !== user.userName) patch.userName = name
    if (registration && registration !== user.userRegistration) {
      const regParsed = cpfCnpjSchema.safeParse(registration)
      if (!regParsed.success) {
        toast.error("CPF/CNPJ invalido.")
        return
      }
      patch.userRegistration = regParsed.data
    }
    if (email && email !== (user.userEmail ?? "")) patch.userEmail = email
    if (phone && phone !== (user.userPhone ?? "")) {
      const phoneParsed = phoneE164Schema.safeParse(phone)
      if (!phoneParsed.success) {
        toast.error("Telefone invalido. Use formato +5511999999999.")
        return
      }
      patch.userPhone = phoneParsed.data
    }

    if (Object.keys(patch).length === 0) {
      toast.message("Nenhuma alteracao detectada.")
      onOpenChange(false)
      return
    }

    try {
      await mutation.mutateAsync(patch)
      void queryClient.invalidateQueries({
        queryKey: userDetailsQueryKey(enterpriseId, userId),
      })
      if (memberId) {
        void queryClient.invalidateQueries({
          queryKey: memberQueryKey(enterpriseId, memberId),
        })
      }
      onOpenChange(false)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Editar dados do utilizador</SheetTitle>
          <SheetDescription>
            Altere nome, CPF/CNPJ, e-mail ou telefone. Credenciais de login podem
            ser sincronizadas automaticamente.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="member-userName">Nome completo</FieldLabel>
              <Input
                id="user-userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                minLength={2}
                maxLength={255}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="member-userRegistration">CPF/CNPJ</FieldLabel>
              <Input
                id="user-userRegistration"
                value={userRegistration}
                onChange={(e) => setUserRegistration(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="member-userEmail">E-mail</FieldLabel>
              <Input
                id="user-userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="member-userPhone">Telefone</FieldLabel>
              <Input
                id="user-userPhone"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                required
              />
              <FieldDescription>Apenas digitos, 8 a 20 caracteres.</FieldDescription>
            </Field>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  )
}
