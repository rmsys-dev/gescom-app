"use client"

import { useState } from "react"
import {
  ClipboardCheck,
  ClipboardCopy,
  Mail,
  MessageCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SUPPORT_CONTACT } from "@/modules/support/support-contact"

const whatsappUrl = `https://wa.me/${SUPPORT_CONTACT.whatsappE164}?text=${encodeURIComponent(SUPPORT_CONTACT.whatsappDefaultMessage)}`

export function SupportContactCards() {
  const [copied, setCopied] = useState(false)

  async function handleCopyEmail() {
    await navigator.clipboard.writeText(SUPPORT_CONTACT.email)
    setCopied(true)
    toast.success("E-mail copiado para a área de transferência.")
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="h-full transition-colors hover:bg-muted/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="size-5 text-primary" aria-hidden />
            <CardTitle className="text-base">WhatsApp</CardTitle>
          </div>
          <CardDescription>
            Fale com nossa equipe pelo WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium tabular-nums text-foreground">
              {SUPPORT_CONTACT.whatsappDisplay}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {SUPPORT_CONTACT.businessHours}
            </p>
          </div>
          <Button asChild tooltip="Abrir conversa no WhatsApp">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Iniciar conversa
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card className="h-full transition-colors hover:bg-muted/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="size-5 text-primary" aria-hidden />
            <CardTitle className="text-base">E-mail</CardTitle>
          </div>
          <CardDescription>
            Envie sua solicitação por e-mail
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium text-foreground">{SUPPORT_CONTACT.email}</p>
          <Button
            type="button"
            variant="outline"
            tooltip="Copiar endereço de e-mail"
            onClick={handleCopyEmail}
          >
            {copied ? (
              <ClipboardCheck className="size-4" aria-hidden />
            ) : (
              <ClipboardCopy className="size-4" aria-hidden />
            )}
            {copied ? "Copiado" : "Copiar e-mail"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
