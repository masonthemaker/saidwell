import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import type { ClientOrg, UseClientsReturn } from './types'

export function useClients(): UseClientsReturn {
  const supabase = useMemo(() => createClient(), [])
  const { user, roles, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
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
    clients,
    error,
    refresh,
  }
}

export default useClients


