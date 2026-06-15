"use client"

import { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

const DEFAULT_ROW_HEIGHT = 49
export const VIRTUALIZE_ROW_THRESHOLD = 50

export function useVirtualRows({
  count,
  rowHeight = DEFAULT_ROW_HEIGHT,
  enabled = true,
}: {
  count: number
  rowHeight?: number
  enabled?: boolean
}) {
  const parentRef = useRef<HTMLDivElement>(null)
  const shouldVirtualize = enabled && count >= VIRTUALIZE_ROW_THRESHOLD

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
    enabled: shouldVirtualize,
  })

  return {
    parentRef,
    shouldVirtualize,
    virtualizer,
    virtualRows: shouldVirtualize ? virtualizer.getVirtualItems() : null,
    totalSize: shouldVirtualize ? virtualizer.getTotalSize() : undefined,
  }
}
