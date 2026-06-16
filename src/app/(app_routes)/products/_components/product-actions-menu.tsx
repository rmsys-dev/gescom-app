"use client"

import Link from "next/link"
import { Eye, MoreVertical, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ProductActionsMenuProps = {
  productId: string
  basePath: string
  onView: () => void
}

export function ProductActionsMenu({
  productId,
  basePath,
  onView,
}: ProductActionsMenuProps) {
  const detailHref = `${basePath}/${productId}`

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
        <DropdownMenuItem asChild>
          <Link
            href={detailHref}
            className="flex cursor-pointer items-center gap-2"
          >
            <Pencil className="size-4 shrink-0" aria-hidden />
            Editar
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
