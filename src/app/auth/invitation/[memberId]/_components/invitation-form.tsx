"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/authentication/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DOCUMENT_LOGIN_TYPE,
  type LoginType,
} from "@/modules/authentication/auth.schema"
import {
  invitationAcceptService,
  invitationDeclineService,
  invitationResendService,
} from "@/modules/authentication/invitation.service"
import Image from "next/image"

type InvitationFormProps = {
  memberId: string
  isAuthenticated: boolean
  className?: string
}

function normalizeLoginValue(loginType: LoginType, raw: string) {
  if (loginType === "EMAIL") {
    return raw.trim().toLowerCase()
  }
  return raw.replace(/\D/g, "")
}

export function InvitationForm({
  memberId,
  isAuthenticated,
  className,
}: InvitationFormProps) {
  const router = useRouter()
  const { refreshSession, signIn } = useAuth()
  const [loginType, setLoginType] = useState<LoginType>("EMAIL")

  const acceptMutation = useMutation({
    mutationFn: (input: {
      loginType: LoginType
      login: string
      password: string
      code: string
    }) => invitationAcceptService(memberId, input),
  })

  const declineMutation = useMutation({
    mutationFn: () => invitationDeclineService(memberId),
  })

  const resendMutation = useMutation({
    mutationFn: () => invitationResendService(memberId),
  })

  const isPending =
    acceptMutation.isPending ||
    declineMutation.isPending ||
    resendMutation.isPending

  async function handleAccept(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const loginInput = form.elements.namedItem("login") as HTMLInputElement
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement
    const codeInput = form.elements.namedItem("code") as HTMLInputElement

    const login = normalizeLoginValue(loginType, loginInput.value)
    const password = passwordInput.value
    const code = codeInput.value.replace(/\D/g, "")

    if (loginType !== "EMAIL" && login.length === 0) {
      toast.error("Informe um CPF ou CNPJ valido.")
      return
    }

    if (!code.trim()) {
      toast.error("Informe o codigo do convite.")
      return
    }

    try {
      const response = await acceptMutation.mutateAsync({
        loginType,
        login,
        password,
        code,
      })

      signIn(response)
      await refreshSession()
      toast.success("Convite aceite com sucesso.")

      if (response.enterprises.length > 1) {
        router.push("/auth/select-enterprise")
        return
      }

      router.push("/home")
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  async function handleDecline() {
    if (!isAuthenticated) {
      toast.error("Entre na sua conta para recusar o convite.")
      router.push("/auth/login")
      return
    }

    try {
      const response = await declineMutation.mutateAsync()
      toast.success(response?.message ?? "Convite recusado.")
      router.push("/home")
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  async function handleResend() {
    if (!isAuthenticated) {
      toast.error("Entre na sua conta para reenviar o codigo.")
      router.push("/auth/login")
      return
    }

    try {
      const response = await resendMutation.mutateAsync()
      toast.success(response?.message ?? "Codigo reenviado.")
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleAccept}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Convite de acesso</h1>
                <p className="text-balance text-muted-foreground">
                  Informe suas credenciais e o código recebido para aceitar o
                  convite
                </p>
              </div>

              {!isAuthenticated ? (
                <FieldDescription className="border border-border bg-muted/50 p-3 text-center">
                  Esta etapa não exige sessão ativa. <br />Use o mesmo E-mail/CPF e
                  senha do seu acesso Gescom.
                </FieldDescription>
              ) : null}

              <Field>
                <FieldLabel htmlFor="loginType">Tipo de Identificação</FieldLabel>
                <Select
                  value={loginType}
                  onValueChange={(value) => setLoginType(value as LoginType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de login" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMAIL">E-mail</SelectItem>
                    <SelectItem value={DOCUMENT_LOGIN_TYPE}>CPF/CNPJ</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="login">
                  {loginType === "EMAIL" ? "E-mail" : "CPF/CNPJ"}
                </FieldLabel>
                <Input
                  id="login"
                  name="login"
                  type={loginType === "EMAIL" ? "email" : "text"}
                  placeholder={
                    loginType === "EMAIL"
                      ? "seu@email.com"
                      : "000.000.000-00 ou 00.000.000/0000-00"
                  }
                  required
                  autoComplete={loginType === "EMAIL" ? "email" : "off"}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="code">Código do convite</FieldLabel>
                <Input
                  id="code"
                  name="code"
                  placeholder="000000"
                  required
                  autoComplete="one-time-code"
                />
              </Field>

              <Field>
                <Button
                  type="submit"
                  variant="default"
                  disabled={isPending}
                  className="w-full"
                  tooltip="Aceitar convite"
                >
                  {acceptMutation.isPending
                    ? "Aceitando..."
                    : "Aceitar convite"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Recusar ou reenviar ainda exige sessão ativa.
              </FieldDescription>

              <Field>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className="w-full"
                  tooltip="Reenviar código"
                  onClick={() => void handleResend()}
                >
                  {resendMutation.isPending
                    ? "Reenviando..."
                    : "Reenviar código"}
                </Button>
              </Field>

              <Field>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isPending}
                  className="w-full"
                  tooltip="Recusar convite"
                  onClick={() => void handleDecline()}
                >
                  {declineMutation.isPending
                    ? "Recusando..."
                    : "Recusar convite"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                <Link
                  href="/auth/first-access"
                  className="underline-offset-2 hover:underline"
                >
                  Primeiro acesso
                </Link>
                {" | "}
                <Link
                  href={isAuthenticated ? "/home" : "/auth/login"}
                  className="underline-offset-2 hover:underline"
                >
                  {isAuthenticated ? "Voltar ao painel" : "Voltar ao login"}
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
              alt="Painel de analise e sistemas"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width={500}
              height={500}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
