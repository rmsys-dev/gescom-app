import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreVertical, Pencil } from "lucide-react"
import Link from "next/link"


export type TableListingActionsMenuProps = {
    itemId: string
    basePath: string
    onView: () => void
    viewLabel?: string
    editLabel?: string
    ariaLabel?: string
    tooltip?: string
}

export function TableListingActionsMenu({
    itemId,
    basePath,
    onView,
    viewLabel = "Visualizar",
    editLabel = "Editar",
    ariaLabel = "Abrir menu de ações",
    tooltip = "Ações",
}: TableListingActionsMenuProps) {
    const detailHref = `${basePath}/${itemId}`

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={ariaLabel}
                    tooltip={tooltip}
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
                    {viewLabel}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        href={detailHref}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <Pencil className="size-4 shrink-0" aria-hidden />
                        {editLabel}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}