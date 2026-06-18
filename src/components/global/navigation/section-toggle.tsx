"use client"

import type { ReactNode } from "react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

export type SectionToggleOption<T extends string> = {
  id: T
  label: string
}

type SectionToggleProps<T extends string> = {
  value: T
  onValueChange: (value: T) => void
  options: SectionToggleOption<T>[]
  ariaLabel: string
  idPrefix?: string
  className?: string
}

export function SectionToggle<T extends string>({
  value,
  onValueChange,
  options,
  ariaLabel,
  idPrefix = "section",
  className,
}: SectionToggleProps<T>) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next as T)
      }}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "w-full flex-wrap border border-border/60 bg-muted/30 p-1",
        className
      )}
    >
      {options.map(({ id, label }) => (
        <ToggleGroupItem
          key={id}
          value={id}
          role="tab"
          aria-selected={value === id}
          aria-controls={`${idPrefix}-panel-${id}`}
          id={`${idPrefix}-tab-${id}`}
          className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-background/60 hover:text-foreground data-[state=on]:text-foreground"
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

type SectionTogglePanelProps = {
  sectionId: string
  idPrefix?: string
  className?: string
  children: ReactNode
}

export function SectionTogglePanel({
  sectionId,
  idPrefix = "section",
  className,
  children,
}: SectionTogglePanelProps) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${sectionId}`}
      aria-labelledby={`${idPrefix}-tab-${sectionId}`}
      className={cn("min-h-32", className)}
    >
      {children}
    </div>
  )
}
