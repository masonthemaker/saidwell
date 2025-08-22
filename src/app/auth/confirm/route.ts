import { createClient } from '@/lib/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Handle different Supabase email confirmation parameter formats
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  
  // Also check for alternative parameter names that Supabase might use
  const token = searchParams.get('token')
  const confirmation_url = searchParams.get('confirmation_url')
  
  const _next = searchParams.get('next')
  const next = _next?.startsWith('/') ? _next : '/'

  console.log('Confirm route - URL params:', {
    token_hash,
    type,
    token,
    confirmation_url,
    allParams: Object.fromEntries(searchParams.entries())
  })

  // If we have the standard token_hash and type
  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      redirect(next)
    } else {
      console.error('OTP verification error:', error)
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
    }
  }
  
  // If we have a token but not the hash format, try to exchange it
  if (token && !token_hash) {
    const supabase = await createClient()
    
    // Try to exchange the token using the session exchange method
    const { error } = await supabase.auth.exchangeCodeForSession(token)
    
    if (!error) {
      redirect(next)
    } else {
      console.error('Code exchange error:', error)
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
    }
  }

  // Log all parameters for debugging
  console.error('Confirm route - Missing required parameters. Received:', Object.fromEntries(searchParams.entries()))
  
  // If no valid parameters, redirect with detailed error
  redirect(`/auth/error?error=${encodeURIComponent('Missing or invalid confirmation parameters. Please check your email link or request a new confirmation email.')}`)
}
