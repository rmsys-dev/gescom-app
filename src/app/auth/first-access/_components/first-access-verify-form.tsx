"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
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
  parseLoginTypeParam,
  type LoginType,
} from "@/modules/authentication/auth.schema"
import { firstAccessVerifyService } from "@/modules/authentication/first-access.service"
import Image from "next/image"

function normalizeLoginValue(loginType: LoginType, raw: string) {
  if (loginType === "EMAIL") {
    return raw.trim().toLowerCase()
  }
  return raw.replace(/\D/g, "")
}

export function FirstAccessVerifyForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshSession } = useAuth()

  const initialLoginType = useMemo(
    () => parseLoginTypeParam(searchParams.get("loginType")),
    [searchParams]
  )

  const initialLogin = searchParams.get("login") ?? ""

  const [loginType, setLoginType] = useState<LoginType>(initialLoginType)

  const verifyMutation = useMutation({
    mutationFn: firstAccessVerifyService,
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const loginInput = form.elements.namedItem("login") as HTMLInputElement
    const codeInput = form.elements.namedItem("code") as HTMLInputElement
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement
    const confirmPasswordInput = form.elements.namedItem(
      "confirmPassword"
    ) as HTMLInputElement

    const login = normalizeLoginValue(loginType, loginInput.value)
    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (loginType !== "EMAIL" && login.length === 0) {
      toast.error("Informe um CPF ou CNPJ valido.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("As senhas nao coincidem.")
      return
    }

    try {
      await verifyMutation.mutateAsync({
        loginType,
        login,
        code: codeInput.value.replace(/\D/g, ""),
        password,
        confirmPassword,
      })

      const session = await refreshSession()
      if (!session.authenticated) {
        toast.error("Nao foi possivel iniciar a sessao.")
        return
      }

      toast.success("Senha definida com sucesso.")

      if (session.enterprises.length > 1) {
        router.push("/auth/select-enterprise")
        return
      }

      router.push("/home")
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Definir senha</h1>
                <p className="text-balance text-muted-foreground">
                  Informe o codigo recebido e crie sua senha de acesso
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="loginType">Tipo de login</FieldLabel>
                <Select
                  value={loginType}
                  onValueChange={(value) => setLoginType(value as LoginType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
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
                  defaultValue={initialLogin}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="code">Codigo</FieldLabel>
                <Input
                  id="code"
                  name="code"
                  inputMode="numeric"
                  placeholder="000000"
                  required
                  autoComplete="one-time-code"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Nova senha</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  variant="default"
                  disabled={verifyMutation.isPending}
                  className="w-full"
                  tooltip="Concluir acesso"
                >
                  {verifyMutation.isPending ? "Salvando..." : "Concluir acesso"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                <Link
                  href="/auth/first-access"
                  className="underline-offset-2 hover:underline"
                >
                  Voltar
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
