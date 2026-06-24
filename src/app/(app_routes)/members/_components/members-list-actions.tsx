"use client"

import Link from "next/link"
import { Send, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"

type MembersListActionsProps = {
  isClientsList: boolean
  canCreate: boolean
  canInvite: boolean
  onCreate: () => void
  onInvite: () => void
}

export function MembersListActions({
  isClientsList,
  canCreate,
  canInvite,
  onCreate,
  onInvite,
}: MembersListActionsProps) {
  return (
    <>
      {canCreate &&
        (isClientsList ? (
          <Button asChild>
            <Link href="/clients/new">
              <UserPlus className="size-4" aria-hidden />
              Adicionar cliente
            </Link>
          </Button>
        ) : (
          <Button type="button" onClick={onCreate}>
            <UserPlus className="size-4" aria-hidden />
            Adicionar membro
          </Button>
        ))}
      {canInvite &&
        (isClientsList ? (
          <Button asChild variant="outline">
            <Link href="/clients/link">
              <Send className="size-4" aria-hidden />
              Convidar cliente
            </Link>
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={onInvite}>
            <Send className="size-4" aria-hidden />
            Convidar membro
          </Button>
        ))}
    </>
  )
}
