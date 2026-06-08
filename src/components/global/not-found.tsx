"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowLeft,
  ClipboardCheck,
  ClipboardCopy,
  Home,
  LogIn,
  MapPinned,
  SearchX,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function NotFoundView() {
  const router = useRouter()
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  async function handleCopyPath() {
    const value =
      typeof window === "undefined"
        ? pathname
        : `${window.location.origin}${pathname}`

    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden p-6 md:p-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,var(--color-gescom-accent-soft-bg),transparent_32%),radial-gradient(circle_at_bottom_right,var(--color-gescom-background-sutil),transparent_34%)]" />
      <div className="absolute left-6 top-10 -z-10 size-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-8 right-8 -z-10 size-52 rounded-full bg-gescom-accent/15 blur-3xl" />

      <Card className="group w-full max-w-4xl border-border/70 bg-card/90 shadow-card backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover">
        <CardHeader className="items-center gap-3 px-6 pt-8 text-center">
          <CardTitle className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Página não encontrada
          </CardTitle>
          <CardDescription>
            O endereço pode ter sido movido, removido ou digitado com algum
            detalhe diferente.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-8 px-6 pb-8 md:grid-cols-[1fr_1.15fr] md:items-center">
          <div className="relative mx-auto flex aspect-square w-full max-w-72 items-center justify-center rounded-full border bg-linear-to-br from-background to-muted/70 shadow-main-xsmall">
            <div className="absolute inset-6 rounded-full border border-dashed border-primary/30 transition-transform duration-700 group-hover:rotate-12" />
            <div className="absolute left-8 top-10 rounded-2xl border bg-card p-3 shadow-card transition-transform duration-500 group-hover:-translate-y-2">
              <MapPinned className="size-5 text-primary" />
            </div>
            <div className="absolute bottom-10 right-7 rounded-2xl border bg-card p-3 shadow-card transition-transform duration-500 group-hover:translate-x-2">
              <SearchX className="size-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-gradient text-7xl font-black tabular-nums tracking-tighter md:text-8xl">
                404
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Rota não localizada
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-xl border bg-background/70 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Você tentou acessar
              </p>
              <p className="mt-2 truncate font-mono text-sm text-foreground">
                {pathname}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild size="lg" tooltip="Ir para o início">
                <Link href="/home">
                  <Home />
                  Ir para o início
                </Link>
              </Button>
              <Button type="button" variant="outline" size="lg" tooltip="Voltar à página anterior" onClick={router.back}>
                <ArrowLeft />
                Voltar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                tooltip="Copiar endereço da página"
                onClick={handleCopyPath}
              >
                {copied ? <ClipboardCheck /> : <ClipboardCopy />}
                {copied ? "Endereço copiado" : "Copiar endereço"}
              </Button>
              <Button asChild variant="secondary" size="lg" tooltip="Fazer login">
                <Link href="/auth/login">
                  <LogIn />
                  Fazer login
                </Link>
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground md:text-left">
              Se você veio por um favorito ou link compartilhado, tente acessar
              pelo painel inicial para encontrar o recurso atualizado.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
