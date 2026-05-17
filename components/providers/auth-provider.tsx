'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthErrorResponse, LoginPayload, PublicAuthSession, RegisterPayload } from '@/lib/auth'

interface AuthContextValue {
  session: PublicAuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<PublicAuthSession>
  register: (payload: RegisterPayload) => Promise<PublicAuthSession>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<PublicAuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let active = true

    async function loadSession() {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          cache: 'no-store',
        })
        const body = (await response.json()) as { session: PublicAuthSession | null }

        if (active) {
          setSession(body.session)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadSession()

    return () => {
      active = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,
      isAuthenticated: Boolean(session),
      login: async (payload) => {
        const nextSession = await postAuthSession('/api/auth/login', payload)
        setSession(nextSession)
        router.refresh()
        return nextSession
      },
      register: async (payload) => {
        const nextSession = await postAuthSession('/api/auth/register', payload)
        setSession(nextSession)
        router.refresh()
        return nextSession
      },
      logout: async () => {
        await postLogout()
        setSession(null)
        router.refresh()
      },
    }),
    [isLoading, router, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

async function postAuthSession(path: string, payload: LoginPayload | RegisterPayload): Promise<PublicAuthSession> {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = (await safeJson<AuthErrorResponse>(response)) ?? {}
    throw new Error(body.message ?? 'Authentication request failed')
  }

  const body = (await response.json()) as { session: PublicAuthSession }
  return body.session
}

async function postLogout(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  })

  if (!response.ok) {
    const body = (await safeJson<AuthErrorResponse>(response)) ?? {}
    throw new Error(body.message ?? 'Unable to sign out right now')
  }
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}
