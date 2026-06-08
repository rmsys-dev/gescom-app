"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

type PageRefreshStatus = {
  isFetching: boolean
  disabled: boolean
}

type PageRefreshContextValue = {
  status: PageRefreshStatus | null
  onRefreshRef: React.RefObject<(() => void) | null>
  setStatus: React.Dispatch<React.SetStateAction<PageRefreshStatus | null>>
}

const PageRefreshContext = createContext<PageRefreshContextValue | null>(null)

export function PageRefreshProvider({ children }: { children: ReactNode }) {
  const onRefreshRef = useRef<(() => void) | null>(null)
  const [status, setStatus] = useState<PageRefreshStatus | null>(null)

  const value = useMemo(
    () => ({ status, onRefreshRef, setStatus }),
    [status]
  )

  return (
    <PageRefreshContext.Provider value={value}>
      {children}
    </PageRefreshContext.Provider>
  )
}

function usePageRefreshContext() {
  const context = useContext(PageRefreshContext)

  if (!context) {
    throw new Error(
      "Page refresh hooks must be used within PageRefreshProvider"
    )
  }

  return context
}

export function useRegisterPageRefresh({
  onRefresh,
  isFetching = false,
  disabled = false,
  enabled = true,
}: {
  onRefresh: () => void
  isFetching?: boolean
  disabled?: boolean
  enabled?: boolean
}) {
  const { onRefreshRef, setStatus } = usePageRefreshContext()

  onRefreshRef.current = enabled ? onRefresh : null

  useEffect(() => {
    if (!enabled) {
      setStatus(null)
      return
    }

    setStatus((prev) => {
      if (
        prev?.isFetching === isFetching &&
        prev?.disabled === disabled
      ) {
        return prev
      }

      return { isFetching, disabled }
    })

    return () => setStatus(null)
  }, [disabled, enabled, isFetching, setStatus])
}

export function usePageRefreshButton() {
  const { status, onRefreshRef } = usePageRefreshContext()

  const triggerRefresh = useCallback(() => {
    onRefreshRef.current?.()
  }, [onRefreshRef])

  if (!status) {
    return null
  }

  return {
    onRefresh: triggerRefresh,
    isFetching: status.isFetching,
    disabled: status.disabled,
  }
}
