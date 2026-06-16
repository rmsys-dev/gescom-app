"use client"

import { Eye, MoreVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PromotionalPriceActionsMenuProps = {
  onView: () => void
}

export function PromotionalPriceActionsMenu({
  onView,
}: PromotionalPriceActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Abrir menu de ações"
          tooltip="Ações"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2"
          onSelect={(e) => {
            e.preventDefault()
            onView()
          }}
        >
          <Eye className="size-4 shrink-0" aria-hidden />
          Visualizar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
