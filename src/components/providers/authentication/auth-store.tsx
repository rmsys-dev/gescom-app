"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useQueryClient } from "@tanstack/react-query"
import type {
  ActiveEnterprise,
  AuthEnterprise,
  AuthUser,
  MeResponse,
} from "@/modules/authentication/auth.schema"
import type {
  LoginClientResponse,
  SessionBootstrap,
} from "@/lib/auth/session-response"
import { clearTenantQueries } from "@/lib/react-query/clear-tenant-queries"
import {
  fetchAuthMe,
  fetchSessionBootstrap,
  logoutService,
  meUserToAuthUser,
  switchEnterpriseService,
} from "@/modules/authentication/auth.service"

type AuthStoreValue = {
  user: AuthUser | null
  enterprises: AuthEnterprise[]
  activeEnterprise: ActiveEnterprise | null
  hydrated: boolean
  isAuthenticated: boolean
  signIn: (payload: LoginClientResponse) => void
  refreshSession: () => Promise<SessionBootstrap>
  switchToEnterprise: (enterprise: AuthEnterprise) => Promise<void>
  signOut: () => void
  logout: () => Promise<void>
}

const ACCOUNT_QUERY_KEY = ["account", "me"] as const

type AuthenticatedSession = Extract<SessionBootstrap, { authenticated: true }>

function mePayloadFromSession(session: AuthenticatedSession): MeResponse {
  return {
    user: session.user,
    enterprise: session.enterprise,
    departments: session.departments,
    permissions: session.permissions,
  }
}

function seedAccountMeQuery(
  queryClient: ReturnType<typeof useQueryClient>,
  payload: MeResponse
) {
  queryClient.setQueryData([...ACCOUNT_QUERY_KEY], payload)
}

function enterpriseToActive(ent: AuthEnterprise): ActiveEnterprise {
  return {
    id: ent.id,
    tradeName: ent.tradeName,
    legalName: ent.legalName,
    memberId: ent.memberId,
    memberDepartmentId: null,
  }
}

function meEnterpriseToActive(
  ent: NonNullable<MeResponse["enterprise"]>
): ActiveEnterprise {
  return {
    id: ent.id,
    tradeName: ent.tradeName,
    legalName: ent.legalName,
    memberId: ent.memberId,
    memberDepartmentId: ent.memberDepartmentId,
  }
}

const AuthContext = createContext<AuthStoreValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [enterprises, setEnterprises] = useState<AuthEnterprise[]>([])
  const [activeEnterprise, setActiveEnterpriseState] =
    useState<ActiveEnterprise | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const invalidateAccountQueries = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: [...ACCOUNT_QUERY_KEY] })
  }, [queryClient])

  const clearAccountQueries = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["account"] })
  }, [queryClient])

  const signOut = useCallback(() => {
    setUser(null)
    setEnterprises([])
    setActiveEnterpriseState(null)
    setIsAuthenticated(false)
    clearAccountQueries()
  }, [clearAccountQueries])

  const logout = useCallback(async () => {
    try {
      await logoutService()
    } catch {
      // Mantém o fluxo: limpar estado local mesmo se a API falhar.
    }
    signOut()
  }, [signOut])

  const signIn = useCallback(
    (payload: LoginClientResponse) => {
      setUser(payload.user)
      setEnterprises(payload.enterprises)
      setIsAuthenticated(true)
      if (payload.enterprises.length === 1) {
        setActiveEnterpriseState(enterpriseToActive(payload.enterprises[0]))
      } else {
        setActiveEnterpriseState(null)
      }
      invalidateAccountQueries()
    },
    [invalidateAccountQueries]
  )

  const refreshSession = useCallback(async (): Promise<SessionBootstrap> => {
    const session = await fetchSessionBootstrap()
    if (!session.authenticated) {
      signOut()
      return session
    }

    setUser({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      registration: session.user.registration,
      onboardingCompleted: session.user.onboardingCompleted,
    })
    setEnterprises(session.enterprises)
    setIsAuthenticated(true)
    if (session.enterprise) {
      setActiveEnterpriseState(meEnterpriseToActive(session.enterprise))
    } else if (session.enterprises.length === 1) {
      setActiveEnterpriseState(enterpriseToActive(session.enterprises[0]))
    } else {
      setActiveEnterpriseState(null)
    }
    seedAccountMeQuery(queryClient, mePayloadFromSession(session))
    invalidateAccountQueries()
    return session
  }, [invalidateAccountQueries, queryClient, signOut])

  const switchToEnterprise = useCallback(
    async (enterprise: AuthEnterprise) => {
      const res = await switchEnterpriseService(enterprise.id)
      const me = await fetchAuthMe()
      setUser(meUserToAuthUser(me.user))
      if (me.enterprise) {
        setActiveEnterpriseState(meEnterpriseToActive(me.enterprise))
      } else {
        setActiveEnterpriseState({
          id: enterprise.id,
          tradeName: enterprise.tradeName,
          legalName: enterprise.legalName,
          memberId: res.enterprise.memberId,
          memberDepartmentId: res.enterprise.memberDepartmentId,
        })
      }
      setIsAuthenticated(true)
      seedAccountMeQuery(queryClient, me)
      clearTenantQueries(queryClient)
      invalidateAccountQueries()
    },
    [invalidateAccountQueries, queryClient]
  )

  useEffect(() => {
    async function hydrate() {
      try {
        const session = await fetchSessionBootstrap()
        if (!session.authenticated) {
          signOut()
          return
        }

        setUser({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          registration: session.user.registration,
          onboardingCompleted: session.user.onboardingCompleted,
        })
        setEnterprises(session.enterprises)
        setIsAuthenticated(true)
        if (session.enterprise) {
          setActiveEnterpriseState(meEnterpriseToActive(session.enterprise))
        } else if (session.enterprises.length === 1) {
          setActiveEnterpriseState(enterpriseToActive(session.enterprises[0]))
        } else {
          setActiveEnterpriseState(null)
        }
        seedAccountMeQuery(queryClient, mePayloadFromSession(session))
      } catch {
        signOut()
      } finally {
        setHydrated(true)
      }
    }

    void hydrate()
  }, [queryClient, signOut])

  const value = useMemo<AuthStoreValue>(
    () => ({
      user,
      enterprises,
      activeEnterprise,
      hydrated,
      isAuthenticated,
      signIn,
      refreshSession,
      switchToEnterprise,
      signOut,
      logout,
    }),
    [
      activeEnterprise,
      enterprises,
      hydrated,
      isAuthenticated,
      logout,
      refreshSession,
      signIn,
      signOut,
      switchToEnterprise,
      user,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.")
  }
  return context
}
