export function UserOnboardingEmpty({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center border border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center"
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
