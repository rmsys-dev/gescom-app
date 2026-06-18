import { cn } from "@/lib/utils"


export function AnimatedLoading() {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={cn(
                "pointer-events-none h-0.5 overflow-hidden bg-primary/15 fixed inset-x-0 top-0 z-50 w-full",
            )}
        >
            <div
                className="absolute h-full w-[35%] animate-loading-bar rounded-full bg-linear-to-r from-primary via-gescom-secondary to-primary"
                aria-hidden
            />
        </div>
    )
}
