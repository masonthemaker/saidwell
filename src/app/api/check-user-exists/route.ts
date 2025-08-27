import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Create a service role client to check users
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data: existingUsers, error: listError } = await serviceSupabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error checking existing users:', listError)
      return NextResponse.json(
        { error: 'Failed to verify user status' },
        { status: 500 }
      )
    }

    const existingUser = existingUsers.users.find(user => user.email === email)

    return NextResponse.json({ 
      exists: !!existingUser,
      userId: existingUser?.id || null
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
