import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session, User } from '@supabase/supabase-js'

type UserClient = {
  client_id: string
  client_name: string
  company_id: string
  role: string
}

type UseAuthReturn = {
  isLoading: boolean
  session: Session | null
  user: User | null
  accessToken: string | null
  refresh: () => Promise<void>
  // Company-level memberships and roles
  memberships: Array<{ company_id: string; role: string }>
  roles: string[]
  hasRole: (requiredRole: string) => boolean
  isOwner: () => boolean
  isAdmin: () => boolean
  isUser: () => boolean
  isClient: () => boolean
  // Client-level relationships
  userClients: UserClient[]
  clientRoles: string[]
  hasClientRole: (requiredRole: string) => boolean
  isClientAdmin: () => boolean
  isClientMember: () => boolean
  getCurrentClient: () => UserClient | null
  setCurrentClient: (clientId: string) => void
}

export function useAuth(): UseAuthReturn {
  const supabase = useMemo(() => createClient(), [])

  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [memberships, setMemberships] = useState<Array<{ company_id: string; role: string }>>([])
  const [roles, setRoles] = useState<string[]>([])
  const [userClients, setUserClients] = useState<UserClient[]>([])
  const [clientRoles, setClientRoles] = useState<string[]>([])
  const [currentClient, setCurrentClientState] = useState<UserClient | null>(null)

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
      setMemberships([])
      setRoles([])
      return
    }

    const uniqueRoles = Array.from(new Set((data ?? []).map(m => m.role)))
    setMemberships(data ?? [])
    setRoles(uniqueRoles)
  }

  const loadUserClients = async (userId: string | undefined) => {
    if (!userId) {
      setUserClients([])
      setClientRoles([])
      setCurrentClientState(null)
      return
    }

    // First, get user-client relationships
    const { data: userClientData, error: userClientError } = await supabase
      .from('user_clients')
      .select('client_id, role')
      .eq('user_id', userId)

    if (userClientError) {
      setUserClients([])
      setClientRoles([])
      setCurrentClientState(null)
      return
    }

    if (!userClientData || userClientData.length === 0) {
      setUserClients([])
      setClientRoles([])
      setCurrentClientState(null)
      return
    }

    // Then get client details separately to avoid circular policy issues
    const clientIds = userClientData.map(uc => uc.client_id)
    const { data: clientDetails, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, company_id')
      .in('id', clientIds)

    if (clientsError) {
      setUserClients([])
      setClientRoles([])
      setCurrentClientState(null)
      return
    }

    // Combine the data
    const clientsData: UserClient[] = userClientData
      .map(uc => {
        const client = clientDetails?.find(c => c.id === uc.client_id)
        if (!client) return null
        return {
          client_id: uc.client_id,
          client_name: client.name,
          company_id: client.company_id,
          role: uc.role
        }
      })
      .filter(Boolean) as UserClient[]

    const uniqueClientRoles = Array.from(new Set(clientsData.map(c => c.role)))
    setUserClients(clientsData)
    setClientRoles(uniqueClientRoles)

    // Set first client as current if none selected
    if (clientsData.length > 0 && !currentClient) {
      setCurrentClientState(clientsData[0])
    }
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
      await loadUserClients(currentSession?.user?.id)
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
      void loadUserClients(newSession?.user?.id)
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
    // Company-level memberships and roles
    memberships,
    roles,
    hasRole: (requiredRole: string) => roles.includes(requiredRole),
    isOwner: () => roles.includes('owner'),
    isAdmin: () => roles.includes('admin'),
    isUser: () => roles.includes('member') || roles.includes('user'),
    isClient: () => roles.includes('client'),
    // Client-level relationships
    userClients,
    clientRoles,
    hasClientRole: (requiredRole: string) => clientRoles.includes(requiredRole),
    isClientAdmin: () => clientRoles.includes('admin'),
    isClientMember: () => clientRoles.includes('member'),
    getCurrentClient: () => currentClient,
    setCurrentClient: (clientId: string) => {
      const client = userClients.find(c => c.client_id === clientId)
      if (client) {
        setCurrentClientState(client)
      }
    },
  }
}

export default useAuth


