"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
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
import { DOCUMENT_LOGIN_TYPE } from "@/modules/authentication/auth.schema"
import {
  passwordResetRequestService,
  passwordResetResendService,
} from "@/modules/authentication/password-reset.service"
import Image from "next/image"

type IdentifierType = "email" | "cpf"

function normalizeIdentifier(type: IdentifierType, raw: string) {
  if (type === "email") {
    return raw.trim().toLowerCase()
  }
  return raw.replace(/\D/g, "")
}

function buildLookupBody(type: IdentifierType, value: string) {
  if (type === "email") {
    return { email: value }
  }
  return { cpf: value }
}

export function PasswordResetForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [identifierType, setIdentifierType] = useState<IdentifierType>("email")
  const [lastIdentifier, setLastIdentifier] = useState<string | null>(null)

  const requestMutation = useMutation({
    mutationFn: passwordResetRequestService,
  })

  const resendMutation = useMutation({
    mutationFn: passwordResetResendService,
  })

  function getIdentifierFromForm(form: HTMLFormElement) {
    const input = form.elements.namedItem("identifier") as HTMLInputElement
    const value = normalizeIdentifier(identifierType, input.value)
    if (identifierType === "cpf" && value.length === 0) {
      toast.error("Informe um CPF valido.")
      return null
    }
    if (identifierType === "email" && value.length === 0) {
      toast.error("Informe um e-mail valido.")
      return null
    }
    return value
  }

  async function handleRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = getIdentifierFromForm(e.currentTarget)
    if (!value) return

    try {
      const response = await requestMutation.mutateAsync(
        buildLookupBody(identifierType, value)
      )
      setLastIdentifier(value)
      toast.success(response.message)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  async function handleResend() {
    if (!lastIdentifier) {
      toast.error("Solicite o codigo primeiro.")
      return
    }

    try {
      const response = await resendMutation.mutateAsync(
        buildLookupBody(identifierType, lastIdentifier)
      )
      toast.success(response.message)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  function goToVerify(form: HTMLFormElement) {
    const value = getIdentifierFromForm(form)
    if (!value) return

    const loginType = identifierType === "email" ? "EMAIL" : DOCUMENT_LOGIN_TYPE
    const params = new URLSearchParams({
      loginType,
      login: value,
    })
    router.push(`/auth/password-reset/verify?${params.toString()}`)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleRequest}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Recuperar senha</h1>
                <p className="text-balance text-muted-foreground">
                  Informe seu E-mail ou CPF/CNPJ para receber o código de
                  redefinição
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="identifierType">Identificação</FieldLabel>
                <Select
                  value={identifierType}
                  onValueChange={(value) =>
                    setIdentifierType(value as IdentifierType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="cpf">CPF/CNPJ</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="identifier">
                  {identifierType === "email" ? "E-mail" : "CPF/CNPJ"}
                </FieldLabel>
                <Input
                  id="identifier"
                  name="identifier"
                  type={identifierType === "email" ? "email" : "text"}
                  placeholder={
                    identifierType === "email"
                      ? "seu@email.com"
                      : "000.000.000-00 ou 00.000.000/0000-00"
                  }
                  required
                  autoComplete={identifierType === "email" ? "email" : "off"}
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  variant="default"
                  disabled={requestMutation.isPending}
                  className="w-full"
                  tooltip="Enviar código"
                >
                  {requestMutation.isPending
                    ? "Enviando..."
                    : "Enviar código"}
                </Button>
              </Field>
              <Field>
                <Button
                  type="button"
                  variant="outline"
                  disabled={resendMutation.isPending || !lastIdentifier}
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
                  className="w-full"
                  tooltip="Já tenho o código"
                  onClick={(e) => {
                    const form = (e.currentTarget as HTMLButtonElement).form
                    if (form) goToVerify(form)
                  }}
                >
                  Já tenho o código
                </Button>
              </Field>
              <FieldDescription className="text-center">
                <Link href="/auth/login" className="underline-offset-2 hover:underline">
                  Voltar ao login
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
