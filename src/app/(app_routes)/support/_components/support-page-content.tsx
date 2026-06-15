"use client"

import { SupportContactCards } from "@/app/(app_routes)/support/_components/support-contact-cards"

export function SupportPageContent() {
  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Suporte</h1>
        <p className="text-sm text-muted-foreground">
          Entre em contato com a equipe Gescom para solicitar ajuda
        </p>
      </div>

      <SupportContactCards />
    </main>
  )
}
