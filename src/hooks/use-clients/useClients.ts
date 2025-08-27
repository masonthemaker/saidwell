import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import type { ClientOrg, UseClientsReturn, CreateClientData } from './types'

export function useClients(): UseClientsReturn {
  const supabase = useMemo(() => createClient(), [])
  const { user, roles, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [clients, setClients] = useState<ClientOrg[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  // Memoize the access check to prevent unnecessary re-renders
  const canAccessClients = useMemo(() => {
    return roles.includes('owner') || roles.includes('admin') || roles.includes('member') || roles.includes('user')
  }, [roles])

  const loadClients = useCallback(async () => {
    // Don't do anything while auth is still loading
    if (authLoading) {
      return
    }

    if (!user) {
      setClients([])
      setError(null)
      return
    }

    // Check if user has company access (same logic as sidebar)
    if (!canAccessClients) {
      router.push('/')
      return
    }

    try {
      setError(null)
      // RLS ensures:
      // - Company users (owner/admin/member) see all clients for their company/companies
      // - Other users see nothing unless permitted by policies
      // - Company admins can now see user_clients via the new RLS policy
      const { data, error: queryError } = await supabase
        .from('clients')
        .select(`
          id,
          name,
          company_id,
          created_at,
          companies (
            id,
            name
          ),
          user_clients (
            user_id
          )
        `)
        .order('name', { ascending: true })

      if (queryError) {
        setError(queryError.message)
        setClients([])
        return
      }

      const formatted: ClientOrg[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        company_id: row.company_id,
        company_name: row.companies?.name ?? '',
        user_count: row.user_clients?.length ?? 0,
        created_at: row.created_at,
      }))

      setClients(formatted)
      setHasLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setClients([])
      setHasLoaded(true)
    }
  }, [supabase, user, canAccessClients, router, authLoading])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setHasLoaded(false)
    try {
      await loadClients()
    } finally {
      setIsLoading(false)
    }
  }, [loadClients])

  const addClient = useCallback(async (data: CreateClientData): Promise<boolean> => {
    if (!user || !canAccessClients) {
      setError('Unauthorized to create clients')
      return false
    }

    try {
      setIsCreating(true)
      setError(null)

      // Get user's company ID from memberships
      const { data: memberships, error: membershipError } = await supabase
        .from('memberships')
        .select('company_id')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (membershipError || !memberships) {
        setError('Unable to determine company membership')
        return false
      }

      // Create the client
      const { data: newClient, error: createError } = await supabase
        .from('clients')
        .insert({
          name: data.name.trim(),
          company_id: memberships.company_id
        })
        .select(`
          id,
          name,
          company_id,
          created_at,
          companies (
            id,
            name
          ),
          user_clients (
            user_id
          )
        `)
        .single()

      if (createError) {
        setError(createError.message)
        return false
      }

      // Add to local state
      const formattedClient: ClientOrg = {
        id: newClient.id,
        name: newClient.name,
        company_id: newClient.company_id,
        company_name: (newClient.companies as any)?.name ?? '',
        user_count: newClient.user_clients?.length ?? 0,
        created_at: newClient.created_at,
      }

      setClients(prev => [formattedClient, ...prev])

      // If email provided, invite user as client admin
      if (data.adminEmail?.trim()) {
        try {
          const response = await fetch('/api/invite-client-admin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.adminEmail.trim(),
              clientId: newClient.id,
              clientName: newClient.name
            })
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.warn('Client created but invitation failed:', errorData.error)
            setError(`Client created successfully, but invitation failed: ${errorData.error}`)
          } else {
            const result = await response.json()
            console.log('Invitation sent successfully:', result.message)
          }
        } catch (inviteErr) {
          console.warn('Client created but invitation failed:', inviteErr)
          // Don't fail the whole operation
        }
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client')
      return false
    } finally {
      setIsCreating(false)
    }
  }, [supabase, user, canAccessClients])

  // Load data only once per user session
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        await loadClients()
      } finally {
        setIsLoading(false)
      }
    }
    
    // Only load if we haven't loaded for this user yet
    if (user?.id && !hasLoaded && !authLoading) {
      load()
    } else if (!authLoading && !user) {
      // Clear data if no user and auth is done loading
      setClients([])
      setError(null)
      setIsLoading(false)
      setHasLoaded(false)
    }
  }, [user?.id, authLoading, hasLoaded, loadClients])

  return {
    isLoading,
    isCreating,
    clients,
    error,
    refresh,
    addClient,
  }
}

export default useClients


