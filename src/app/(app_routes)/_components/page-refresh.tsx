"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type PageRefreshRegistration = {
  onRefresh: () => void
  isFetching: boolean
  disabled: boolean
}

type PageRefreshContextValue = {
  registration: PageRefreshRegistration | null
  setRegistration: (registration: PageRefreshRegistration | null) => void
}

const PageRefreshContext = createContext<PageRefreshContextValue | null>(null)

export function PageRefreshProvider({ children }: { children: ReactNode }) {
  const [registration, setRegistration] =
    useState<PageRefreshRegistration | null>(null)

  const value = useMemo(
    () => ({ registration, setRegistration }),
    [registration]
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
  const { setRegistration } = usePageRefreshContext()

  useEffect(() => {
    if (!enabled) {
      setRegistration(null)
      return
    }

    setRegistration({ onRefresh, isFetching, disabled })

    return () => setRegistration(null)
  }, [disabled, enabled, isFetching, onRefresh, setRegistration])
}

export function usePageRefreshButton() {
  return usePageRefreshContext().registration
}
