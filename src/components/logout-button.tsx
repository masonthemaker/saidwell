'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    try {
      // Try global logout first
      const { error } = await supabase.auth.signOut()
      if (error && error.status === 403) {
        // If 403, fallback to local logout
        await supabase.auth.signOut({ scope: 'local' })
      }
    } catch (error) {
      // If any error, force local logout
      console.warn('Logout error, forcing local logout:', error)
      await supabase.auth.signOut({ scope: 'local' })
    } finally {
      // Always redirect regardless of errors
      router.push('/auth/login')
    }
  }

  return <Button onClick={logout}>Logout</Button>
}
