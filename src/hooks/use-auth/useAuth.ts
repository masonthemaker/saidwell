import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session, User } from '@supabase/supabase-js'

type UseAuthReturn = {
  isLoading: boolean
  session: Session | null
  user: User | null
  accessToken: string | null
  refresh: () => Promise<void>
  memberships: Array<{ company_id: string; role: string }>
  roles: string[]
  hasRole: (requiredRole: string) => boolean
  isOwner: () => boolean
  isAdmin: () => boolean
  isUser: () => boolean
  isClient: () => boolean
}

export function useAuth(): UseAuthReturn {
  const supabase = useMemo(() => createClient(), [])

  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [memberships, setMemberships] = useState<Array<{ company_id: string; role: string }>>([])
  const [roles, setRoles] = useState<string[]>([])

  const decodeJwt = (token: string | null) => {
    if (!token) return null
    try {
      const payload = token.split('.')[1]
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
      const json = typeof atob !== 'undefined' ? atob(padded) : Buffer.from(padded, 'base64').toString('utf8')
      return JSON.parse(json)
    } catch {
      return null
    }
  }

  const loadMemberships = async (userId: string | undefined) => {
    if (!userId) {
      setMemberships([])
      setRoles([])
      return
    }
    const { data, error } = await supabase
      .from('memberships')
      .select('company_id, role')
      .eq('user_id', userId)

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[useAuth] memberships query failed', error)
      setMemberships([])
      setRoles([])
      return
    }

    const uniqueRoles = Array.from(new Set((data ?? []).map(m => m.role)))
    setMemberships(data ?? [])
    setRoles(uniqueRoles)

    // eslint-disable-next-line no-console
    console.log(
      '%c[useAuth] MEMBERSHIP ROLES',
      'background:#0b3d2e;color:#fff;font-weight:800;padding:2px 6px;border-radius:4px;',
      { roles: uniqueRoles, memberships: data }
    )
  }

  const load = async () => {
    setIsLoading(true)
    try {
      const { data: sessionData } = await supabase.auth.getSession()

      const currentSession = sessionData.session ?? null
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setAccessToken(currentSession?.access_token ?? null)
      await loadMemberships(currentSession?.user?.id)

      const claims = decodeJwt(currentSession?.access_token ?? null)

      // Initial debug log (sanitized)
      // eslint-disable-next-line no-console
      console.log('[useAuth] session', {
        expires_at: currentSession?.expires_at,
        user: {
          id: currentSession?.user?.id,
          email: currentSession?.user?.email,
          role: (currentSession as any)?.user?.role,
        },
      })
      // eslint-disable-next-line no-console
      console.log('[useAuth] claims (decoded)', claims)
      // eslint-disable-next-line no-console
      console.log(
        '%c[useAuth] CLAIMS',
        'background:#111;color:#fff;font-weight:800;padding:2px 6px;border-radius:4px;',
        claims
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setAccessToken(newSession?.access_token ?? null)
      void loadMemberships(newSession?.user?.id)

      const claims = decodeJwt(newSession?.access_token ?? null)
      // eslint-disable-next-line no-console
      console.log('[useAuth] auth state changed', _event, {
        expires_at: newSession?.expires_at,
        user: {
          id: newSession?.user?.id,
          email: newSession?.user?.email,
          role: (newSession as any)?.user?.role,
        },
        claims,
      })
      // eslint-disable-next-line no-console
      console.log(
        '%c[useAuth] CLAIMS',
        'background:#111;color:#fff;font-weight:800;padding:2px 6px;border-radius:4px;',
        claims
      )
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [supabase])

  return {
    isLoading,
    session,
    user,
    accessToken,
    refresh: load,
    memberships,
    roles,
    hasRole: (requiredRole: string) => roles.includes(requiredRole),
    isOwner: () => roles.includes('owner'),
    isAdmin: () => roles.includes('admin'),
    isUser: () => roles.includes('member') || roles.includes('user'),
    isClient: () => roles.includes('client'),
  }
}

export default useAuth


