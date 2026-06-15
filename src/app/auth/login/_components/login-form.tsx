"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { isSafeInternalReturnUrl, withReturnUrl } from "@/lib/auth/return-url"
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
  DOCUMENT_LOGIN_TYPE,
  type LoginType,
} from "@/modules/authentication/auth.schema"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { loginService } from "@/modules/authentication/auth.service"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function normalizeLoginValue(loginType: LoginType, raw: string) {
  if (loginType === "EMAIL") {
    return raw.trim().toLowerCase()
  }
  return raw.replace(/\D/g, "")
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, refreshSession } = useAuth()
  const [loginType, setLoginType] = useState<LoginType>("EMAIL")
  const loginMutation = useMutation({
    mutationFn: loginService,
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const loginInput = form.elements.namedItem("login") as HTMLInputElement
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement
    const login = normalizeLoginValue(loginType, loginInput.value)
    const password = passwordInput.value

    if (loginType !== "EMAIL") {
      if (login.length === 0) {
        toast.error("Informe um CPF ou CNPJ valido.")
        return
      }
      const doc = cpfCnpjSchema.safeParse(login)
      if (!doc.success) {
        toast.error(doc.error.issues[0]?.message ?? "CPF/CNPJ invalido.")
        return
      }
    }

    try {
      const response = await loginMutation.mutateAsync({
        loginType,
        login,
        password,
      })
      signIn(response)
      await refreshSession()
      toast.success("Login realizado com sucesso.")
      const returnUrl = searchParams.get("returnUrl")
      if (response.enterprises.length > 1) {
        const selectPath = isSafeInternalReturnUrl(returnUrl)
          ? withReturnUrl("/auth/select-enterprise", returnUrl)
          : "/auth/select-enterprise"
        router.push(selectPath)
        return
      }
      if (isSafeInternalReturnUrl(returnUrl)) {
        router.push(returnUrl)
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
                <h1 className="text-2xl font-bold">Gescom ERP</h1>
                <p className="text-balance text-muted-foreground">
                  Faça login para continuar
                </p>
              </div>
              <Field>
                {/* <FieldLabel htmlFor="loginType">Selecione o tipo de login</FieldLabel> */}
                <Select
                  value={loginType}
                  onValueChange={(value) => setLoginType(value as LoginType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de login" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMAIL">Entrar com e-mail</SelectItem>
                    <SelectItem value={DOCUMENT_LOGIN_TYPE}>
                      Entrar com CPF/CNPJ
                    </SelectItem>
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Link
                    href="/auth/password-reset"
                    className="ml-auto text-xs underline-offset-2 hover:underline"
                  >
                    Recuperar senha
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </Field>
              <Field>
                <div className="flex flex-col gap-2">
                  <Button type="submit" variant="default" disabled={loginMutation.isPending} tooltip="Entrar">
                    {loginMutation.isPending ? "Entrando..." : "Entrar"}
                  </Button>
                  <Link
                    href="/auth/first-access"
                    className="text-center text-xs underline-offset-2 hover:underline"
                  >
                    Primeiro acesso?
                  </Link>
                </div>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
              alt="Painel de análise e sistemas"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width={500}
              height={500}
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao continuar, você concorda com nossos{" "}
        <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a>
        .
      </FieldDescription>
    </div>
  )
}
